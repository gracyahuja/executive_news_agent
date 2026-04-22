const { fetchAllSources, filterByDateRange } = require("./rssService");
const { extractNewsletter } = require("./gptService");
const { refineNewsletter } = require("./claudeService");

/**
 * Full pipeline: RSS ingestion → GPT extraction → Claude refinement.
 *
 * @param {object} params
 * @param {string} params.mode        "daily_debrief" | "topic_brief"
 * @param {string} [params.topic]     Required for topic_brief mode
 * @param {string} params.dateFrom    ISO date string (YYYY-MM-DD)
 * @param {string} params.dateTo      ISO date string (YYYY-MM-DD)
 * @returns {object} Refined newsletter JSON + sourceStatus array
 */
async function generateNewsletter({ mode, topic, dateFrom, dateTo }) {
  if (mode === "topic_brief" && !topic?.trim()) {
    throw new Error("topic is required for topic_brief mode");
  }

  // Step 1: Fetch all RSS sources in parallel
  console.log("[Pipeline] Fetching RSS feeds...");
  const { articles, sourceStatus } = await fetchAllSources();
  console.log(
    `[Pipeline] Fetched ${articles.length} articles from ${sourceStatus.filter((s) => !s.error).length}/${sourceStatus.length} sources`
  );

  // Step 2: Filter by date range
  const filtered = filterByDateRange(articles, dateFrom, dateTo);
  console.log(
    `[Pipeline] ${filtered.length} articles within date range ${dateFrom} → ${dateTo}`
  );

  if (filtered.length === 0) {
    return {
      newsletter: buildEmptyNewsletter(mode, topic, dateFrom, dateTo),
      sourceStatus,
    };
  }

  // Step 3: GPT extraction — normalize, cluster, draft
  console.log("[Pipeline] Running GPT extraction step...");
  const draft = await extractNewsletter({
    articles: filtered,
    mode,
    topic: topic?.trim() || null,
    dateFrom,
    dateTo,
  });
  const normalizedDraft = normalizeNewsletterShape(
    draft,
    mode,
    topic,
    dateFrom,
    dateTo
  );
  console.log(
    `[Pipeline] GPT produced ${normalizedDraft.insights?.length || 0} insights`
  );

  // Step 4: Claude refinement — tone and clarity edit
  console.log("[Pipeline] Running Claude refinement step...");
  let refined;
  try {
    refined = await refineNewsletter(normalizedDraft);
    refined = normalizeNewsletterShape(refined, mode, topic, dateFrom, dateTo);
    console.log(
      `[Pipeline] Refinement complete (refined=${refined._refined})`
    );
  } catch (err) {
    console.warn(
      `[Pipeline] Claude refinement failed, falling back to GPT draft: ${err.message}`
    );
    refined = { ...normalizedDraft, _refined: false };
  }

  return { newsletter: refined, sourceStatus };
}

function normalizeNewsletterShape(raw, mode, topic, dateFrom, dateTo) {
  const normalized = { ...(raw || {}) };

  const rawInsights = Array.isArray(normalized.insights)
    ? normalized.insights
    : Array.isArray(normalized.newsletter)
      ? normalized.newsletter
      : [];

  normalized.insights = rawInsights.map((insight, index) =>
    normalizeInsight(insight, index)
  );

  if (typeof normalized.executive_summary !== "string" || !normalized.executive_summary.trim()) {
    normalized.executive_summary = buildExecutiveSummaryFallback(
      normalized.insights,
      mode,
      topic
    );
  }

  normalized.metadata = {
    topic: topic || null,
    date_from: dateFrom,
    date_to: dateTo,
    total_articles_processed:
      normalized.metadata?.total_articles_processed ?? 0,
    total_sources_used: normalized.metadata?.total_sources_used ?? 0,
    generated_at: normalized.metadata?.generated_at || new Date().toISOString(),
  };
  normalized.mode = mode;

  return normalized;
}

function normalizeInsight(insight, index) {
  const urls = Array.isArray(insight?.source_urls) ? insight.source_urls : [];
  const sources = Array.isArray(insight?.sources) && insight.sources.length > 0
    ? insight.sources.map((source) => ({
        title: source.title || source.url || "Source",
        url: source.url,
        publisher: source.publisher || inferPublisherFromUrl(source.url),
      }))
    : urls.map((url) => ({
        title: url,
        url,
        publisher: inferPublisherFromUrl(url),
      }));

  return {
    id: insight?.id || `insight-${index + 1}`,
    headline: insight?.headline || `Insight ${index + 1}`,
    executive_summary: insight?.executive_summary || "",
    why_it_matters: insight?.why_it_matters || "",
    category: normalizeCategory(insight?.category),
    geopolitical_relevance: insight?.geopolitical_relevance || null,
    sources,
  };
}

function normalizeCategory(category) {
  const value = (category || "").toString().trim().toLowerCase();
  const map = {
    geopolitics: "Foreign Affairs",
    geopolitical: "Foreign Affairs",
    foreign_affairs: "Foreign Affairs",
    "foreign affairs": "Foreign Affairs",
    geography: "Geography",
    tariffs: "Tariffs",
    supply_chain: "Supply Chain",
    "supply chain": "Supply Chain",
    retail: "Retail",
    ai: "AI",
    markets: "Markets",
    regulation: "Regulation",
    "consumer trends": "Consumer Trends",
    consumer_trends: "Consumer Trends",
    general: "General",
  };
  return map[value] || "General";
}

function inferPublisherFromUrl(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname;
  } catch {
    return "Unknown";
  }
}

function buildExecutiveSummaryFallback(insights, mode, topic) {
  if (!insights.length) {
    return mode === "topic_brief"
      ? `No source-backed insights were found for "${topic}" in the selected date range. Try broadening the time window or refining the topic.`
      : "No source-backed insights were found for the selected date range. Try broadening the time window.";
  }

  const topHeadlines = insights
    .slice(0, 3)
    .map((insight) => insight.headline)
    .join("; ");

  if (mode === "topic_brief" && topic) {
    return `This brief highlights the most relevant developments related to ${topic}. Key themes include ${topHeadlines}. Review the cited sources for the underlying reporting and validation.`;
  }

  return `This daily debrief summarizes the most important developments across the approved source universe. Leading themes include ${topHeadlines}. Review the cited sources for direct validation and deeper context.`;
}

function buildEmptyNewsletter(mode, topic, dateFrom, dateTo) {
  return {
    executive_summary:
      "No articles were found in the approved source universe for the selected date range. Try expanding the date range or check that your sources are reachable.",
    insights: [],
    mode,
    metadata: {
      topic: topic || null,
      date_from: dateFrom,
      date_to: dateTo,
      total_articles_processed: 0,
      total_sources_used: 0,
      generated_at: new Date().toISOString(),
    },
    _refined: false,
  };
}

module.exports = { generateNewsletter };
