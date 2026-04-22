const Parser = require("rss-parser");
const { SOURCES } = require("../config/sources");

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Costco-Executive-News-Agent/1.0 (internal tool; rss-reader)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["dc:creator", "creator"],
    ],
  },
});

/**
 * Normalize a single parsed RSS item into a consistent article shape.
 */
function normalizeItem(item, source) {
  const pubDate = item.pubDate || item.isoDate || item.date || null;
  return {
    id: `${source.id}_${Buffer.from(item.link || item.guid || item.title || "").toString("base64").slice(0, 16)}`,
    title: (item.title || "").trim(),
    link: item.link || item.guid || "",
    description: item.contentSnippet || item.summary || item.description || "",
    contentSnippet: item.contentSnippet || item.summary || item.description || "",
    pubDate: pubDate ? new Date(pubDate).toISOString() : null,
    pubDateRaw: pubDate,
    publisher: source.name,
    sourceId: source.id,
    category: source.category,
    region: source.region,
  };
}

/**
 * Fetch a single RSS source. Returns { sourceId, articles, error }.
 * Never throws — failures are captured and returned with an error message.
 */
async function fetchSource(source) {
  try {
    const feed = await parser.parseURL(source.url);
    const articles = (feed.items || []).map((item) =>
      normalizeItem(item, source)
    );
    return { sourceId: source.id, articles, error: null };
  } catch (err) {
    console.warn(`[RSS] Failed to fetch ${source.name}: ${err.message}`);
    return { sourceId: source.id, articles: [], error: err.message };
  }
}

/**
 * Fetch all approved sources in parallel. Returns flat article array and per-source status.
 */
async function fetchAllSources() {
  const results = await Promise.allSettled(
    SOURCES.map((source) => fetchSource(source))
  );

  const articles = [];
  const sourceStatus = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      const { sourceId, articles: sourceArticles, error } = result.value;
      const source = SOURCES.find((s) => s.id === sourceId);
      articles.push(...sourceArticles);
      sourceStatus.push({
        sourceId,
        name: source?.name || sourceId,
        articleCount: sourceArticles.length,
        error,
      });
    }
  }

  return { articles, sourceStatus };
}

/**
 * Filter articles by date range.
 * dateFrom and dateTo are ISO strings or Date objects.
 * Articles with no pubDate are included by default (to avoid silently dropping content).
 */
function filterByDateRange(articles, dateFrom, dateTo) {
  const from = new Date(dateFrom);
  from.setHours(0, 0, 0, 0);
  const to = new Date(dateTo);
  to.setHours(23, 59, 59, 999);

  return articles.filter((a) => {
    if (!a.pubDate) return true;
    const pub = new Date(a.pubDate);
    return pub >= from && pub <= to;
  });
}

module.exports = { fetchAllSources, fetchSource, filterByDateRange };
