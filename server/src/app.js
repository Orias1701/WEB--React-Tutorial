const cors = require("cors");
const express = require("express");
const path = require("path");

const landingRoutes = require("./routes/landing.routes");

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const corsError = new Error("CORS policy: origin blocked.");
      corsError.statusCode = 403;
      return callback(corsError);
    }
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(204).end();
});

if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.json({
      message: "API server is running.",
      frontend: "http://localhost:5173",
      health: "/api/health"
    });
  });
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", landingRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found." });
});

if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "..", "..", "client", "dist");

  app.use(express.static(clientDistPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    return res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = statusCode >= 500 ? "Internal server error." : error.message;

  res.status(statusCode).json({ message });
});

module.exports = app;
