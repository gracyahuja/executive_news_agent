const express = require("express");
const { generateNewsletter } = require("../services/newsletterService");
const { fetchAllSources } = require("../services/rssService");
const { SOURCES, THEME_CATEGORIES } = require("../config/sources");

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Return approved source list and theme categories (for UI info)
router.get("/sources", (req, res) => {
  res.json({ sources: SOURCES, themes: THEME_CATEGORIES });
});

/**
 * POST /api/newsletter
 * Body: { mode, topic, dateFrom, dateTo }
 * Returns: { newsletter, sourceStatus }
 */
router.post("/newsletter", async (req, res) => {
  const { mode, topic, dateFrom, dateTo } = req.body;

  // Input validation
  if (!mode || !["daily_debrief", "topic_brief"].includes(mode)) {
    return res.status(400).json({
      error: 'mode must be "daily_debrief" or "topic_brief"',
    });
  }
  if (mode === "topic_brief" && !topic?.trim()) {
    return res.status(400).json({
      error: "topic is required when mode is topic_brief",
    });
  }
  if (!dateFrom || !dateTo) {
    return res.status(400).json({ error: "dateFrom and dateTo are required" });
  }

  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  if (isNaN(from) || isNaN(to)) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  if (from > to) {
    return res.status(400).json({ error: "dateFrom must be before dateTo" });
  }

  try {
    const result = await generateNewsletter({ mode, topic, dateFrom, dateTo });
    res.json(result);
  } catch (err) {
    console.error("[API] Newsletter generation failed:", err.message);
    res.status(500).json({
      error: err.message || "Newsletter generation failed",
      details:
        process.env.NODE_ENV !== "production" ? err.stack : undefined,
    });
  }
});

/**
 * GET /api/feeds/status
 * Quick check of which RSS feeds are currently reachable.
 */
router.get("/feeds/status", async (req, res) => {
  try {
    const { sourceStatus } = await fetchAllSources();
    res.json({ sourceStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
