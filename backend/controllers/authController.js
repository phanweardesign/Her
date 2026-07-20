const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendPasswordResetCode } = require("../services/emailService");

const RESET_CODE_LIFETIME_MS = 60 * 1000;
const RESET_RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_RESET_ATTEMPTS = 5;

function publicUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone || "",
        isEmailVerified: Boolean(user.isEmailVerified)
    };
}

function createToken(user) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured on the server.");
    }
    return jwt.sign({ userId: user._id }, secret, { expiresIn: "7d" });
}

function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
}

function createResetCode() {
    return crypto.randomInt(100000, 1000000).toString();
}

function hashResetCode(code) {
    return crypto.createHash("sha256").update(code).digest("hex");
}

exports.signup = async (req, res) => {
    try {
        const username = String(req.body.username || "").trim();
        const email = normalizeEmail(req.body.email);
        const phone = String(req.body.phone || "").trim();
        const password = String(req.body.password || "");

        if (!username || !email || !phone || !password) {
            return res.status(400).json({ message: "Username, email, phone, and password are required." });
        }
        if (username.length < 3 || username.length > 40) {
            return res.status(400).json({ message: "Username must be between 3 and 40 characters." });
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: "Enter a valid email address." });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters." });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }, { phone }] });
        if (existingUser) {
            return res.status(409).json({ message: "An account already exists with that username, email, or phone number." });
        }

        const user = await User.create({
            username,
            email,
            phone,
            password: await bcrypt.hash(password, 12)
        });

        return res.status(201).json({
            message: "Account created successfully.",
            token: createToken(user),
            user: publicUser(user)
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: "That username, email, or phone number is already in use." });
        }
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Unable to create the account right now." });
    }
};

exports.login = async (req, res) => {
    try {
        const identifier = String(req.body.identifier || "").trim();
        const password = String(req.body.password || "");

        if (!identifier || !password) {
            return res.status(400).json({ message: "Username, email, phone number, and password are required." });
        }

        const normalized = identifier.toLowerCase();
        const user = await User.findOne({
            $or: [{ email: normalized }, { username: identifier }, { phone: identifier }]
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Incorrect username, email, phone number, or password." });
        }

        return res.json({
            message: "Login successful.",
            token: createToken(user),
            user: publicUser(user)
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Unable to log in right now." });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: "Enter a valid email address." });
        }

        const user = await User.findOne({ email }).select("+passwordResetCodeHash +passwordResetExpiresAt +passwordResetAttempts +passwordResetLastSentAt");

        // Do not reveal whether an email is registered.
        if (!user) {
            return res.json({ message: "If that email is registered, a reset code has been sent." });
        }

        const now = Date.now();
        const lastSent = user.passwordResetLastSentAt?.getTime() || 0;
        const cooldownRemaining = RESET_RESEND_COOLDOWN_MS - (now - lastSent);

        if (cooldownRemaining > 0) {
            return res.status(429).json({
                message: "Please wait before requesting another code.",
                retryAfterSeconds: Math.ceil(cooldownRemaining / 1000)
            });
        }

        const code = createResetCode();
        user.passwordResetCodeHash = hashResetCode(code);
        user.passwordResetExpiresAt = new Date(now + RESET_CODE_LIFETIME_MS);
        user.passwordResetAttempts = 0;
        user.passwordResetLastSentAt = new Date(now);
        await user.save();

        try {
            await sendPasswordResetCode({ to: user.email, code });
        } catch (emailError) {
            user.passwordResetCodeHash = null;
            user.passwordResetExpiresAt = null;
            user.passwordResetAttempts = 0;
            await user.save();
            throw emailError;
        }

        return res.json({
            message: "A six-digit reset code was sent to your email. It expires in 1 minute.",
            expiresInSeconds: 60,
            resendAfterSeconds: 60
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ message: error.message || "Unable to send a reset code right now." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const code = String(req.body.code || "").trim();
        const password = String(req.body.password || "");

        if (!email || !/^\d{6}$/.test(code) || !password) {
            return res.status(400).json({ message: "Email, six-digit code, and new password are required." });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters." });
        }

        const user = await User.findOne({ email }).select("+passwordResetCodeHash +passwordResetExpiresAt +passwordResetAttempts +passwordResetLastSentAt");
        if (!user || !user.passwordResetCodeHash || !user.passwordResetExpiresAt) {
            return res.status(400).json({ message: "The reset code is invalid or expired." });
        }

        if (user.passwordResetExpiresAt.getTime() <= Date.now()) {
            user.passwordResetCodeHash = null;
            user.passwordResetExpiresAt = null;
            user.passwordResetAttempts = 0;
            await user.save();
            return res.status(400).json({ message: "The reset code expired. Request a new code." });
        }

        if (user.passwordResetAttempts >= MAX_RESET_ATTEMPTS) {
            user.passwordResetCodeHash = null;
            user.passwordResetExpiresAt = null;
            user.passwordResetAttempts = 0;
            await user.save();
            return res.status(429).json({ message: "Too many incorrect attempts. Request a new code." });
        }

        if (hashResetCode(code) !== user.passwordResetCodeHash) {
            user.passwordResetAttempts += 1;
            const attemptsRemaining = MAX_RESET_ATTEMPTS - user.passwordResetAttempts;

            if (attemptsRemaining <= 0) {
                user.passwordResetCodeHash = null;
                user.passwordResetExpiresAt = null;
                user.passwordResetAttempts = 0;
            }

            await user.save();
            return res.status(400).json({
                message: attemptsRemaining > 0
                    ? `Incorrect code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} remaining.`
                    : "Too many incorrect attempts. Request a new code."
            });
        }

        user.password = await bcrypt.hash(password, 12);
        user.passwordResetCodeHash = null;
        user.passwordResetExpiresAt = null;
        user.passwordResetAttempts = 0;
        user.passwordResetLastSentAt = null;
        await user.save();

        return res.json({ message: "Password reset successfully. You can now log in." });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ message: "Unable to reset the password right now." });
    }
};
