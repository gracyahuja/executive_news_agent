require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
  })
);
app.use(express.json({ limit: "2mb" }));

app.use("/api", apiRouter);

// Catch-all for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error("[Server] Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n🔵 Costco Exec News Agent — Server running on port ${PORT}`);
  console.log(`   OpenAI model:  ${process.env.OPENAI_MODEL || "gpt-4o"}`);
  console.log(`   Anthropic model: claude-sonnet-4-6`);
  console.log(
    `   OpenAI key:   ${process.env.OPENAI_API_KEY ? "✓ set" : "✗ NOT SET (required)"}`
  );
  console.log(
    `   Anthropic key: ${process.env.ANTHROPIC_API_KEY ? "✓ set" : "✗ not set (Claude step will be skipped)"}`
  );
  console.log("");
});

module.exports = app;
