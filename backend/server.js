require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
const frontendRoot = path.resolve(__dirname, "..");

app.disable("x-powered-by");
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
    res.json({ ok: true, service: "Her API", aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
});
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// Allows the backend to serve the frontend directly when Nginx is not being used.
app.use(express.static(frontendRoot));
app.get("/", (req, res) => res.sendFile(path.join(frontendRoot, "index.html")));

app.use((req, res) => res.status(404).json({ message: "Route not found." }));
app.use((error, req, res, next) => {
    console.error("Unhandled server error:", error);
    res.status(500).json({ message: "Unexpected server error." });
});

const PORT = Number(process.env.PORT) || 5000;

async function start() {
    try {
        await connectDB();
        app.listen(PORT, "0.0.0.0", () => console.log(`Her server running on port ${PORT}`));
    } catch (error) {
        console.error("Her failed to start:", error.message);
        process.exit(1);
    }
}

if (require.main === module) start();
module.exports = app;
