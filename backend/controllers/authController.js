const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

function createToken(userId) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is missing from the backend .env file.");
    }

    return jwt.sign(
        { userId },
        secret,
        { expiresIn: "7d" }
    );
}

function cleanText(value) {
    return String(value || "").trim();
}

function normalizeEmail(value) {
    return cleanText(value).toLowerCase();
}

function publicUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone || "",
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
    };
}

exports.signup = async (req, res) => {
    try {
        const username = cleanText(req.body.username);
        const email = normalizeEmail(req.body.email);
        const phone = cleanText(req.body.phone);
        const password = String(req.body.password || "");

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email, and password are required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters."
            });
        }

        const duplicateConditions = [
            { email },
            { username }
        ];

        if (phone) {
            duplicateConditions.push({ phone });
        }

        const existingUser = await User.findOne({
            $or: duplicateConditions
        });

        if (existingUser) {
            return res.status(409).json({
                message: "An account already exists with that email, username, or phone number."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username,
            email,
            phone,
            password: hashedPassword
        });

        const token = createToken(user._id.toString());

        return res.status(201).json({
            message: "Account created successfully.",
            token,
            user: publicUser(user)
        });
    } catch (error) {
        console.error("Signup error:", error);

        if (error?.code === 11000) {
            return res.status(409).json({
                message: "That email, username, or phone number is already registered."
            });
        }

        return res.status(500).json({
            message: error.message || "Unable to create account."
        });
    }
};

exports.login = async (req, res) => {
    try {
        const identifier = cleanText(
            req.body.identifier ||
            req.body.email ||
            req.body.username ||
            req.body.phone
        );

        const password = String(req.body.password || "");

        if (!identifier || !password) {
            return res.status(400).json({
                message: "Email, username, or phone and password are required."
            });
        }

        const normalizedIdentifier = identifier.toLowerCase();

        const user = await User.findOne({
            $or: [
                { email: normalizedIdentifier },
                { username: identifier },
                { phone: identifier }
            ]
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email, username, phone number, or password."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email, username, phone number, or password."
            });
        }

        const token = createToken(user._id.toString());

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: publicUser(user)
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: error.message || "Unable to log in."
        });
    }
};