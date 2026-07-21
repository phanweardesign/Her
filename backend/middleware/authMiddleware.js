const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
    const header = String(req.headers.authorization || "");
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

    if (!token) {
        return res.status(401).json({ message: "Authentication required." });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET is not configured.");
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Your session is invalid or expired. Please log in again." });
    }
};
