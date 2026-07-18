const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

exports.signup = async (req, res) => {
    try {
        const username = String(req.body.username || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
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
            return res.status(400).json({ message: "Username or email and password are required." });
        }

        const normalized = identifier.toLowerCase();
        const user = await User.findOne({
            $or: [
                { email: normalized },
                { username: identifier },
                { phone: identifier }
            ]
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
