require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.disable("x-powered-by");

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        ok: true,
        service: "Her API",
        mongodb: "configured",
        aiConfigured: Boolean(process.env.OPENAI_API_KEY)
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// Basic backend route
app.get("/", (req, res) => {
    res.status(200).json({
        ok: true,
        message: "Her backend is running"
    });
});

// JSON response for unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        message: `API route not found: ${req.method} ${req.originalUrl}`
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error("Server error:", error);

    res.status(error.status || 500).json({
        message: error.message || "Internal server error."
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Her server running on port ${PORT}`);
});