/**
 * JSON schema for structured newsletter extraction.
 * GPT uses this to produce machine-readable output before Claude refines it.
 */

const NEWSLETTER_SCHEMA = {
  type: "object",
  required: ["insights", "executive_summary", "mode", "metadata"],
  properties: {
    executive_summary: {
      type: "string",
      description:
        "3-5 sentence top-level overview for the executive. If topic-specific, connect developments directly to business relevance. State the most important takeaway first.",
    },
    insights: {
      type: "array",
      minItems: 5,
      items: {
        type: "object",
        required: [
          "id",
          "headline",
          "executive_summary",
          "why_it_matters",
          "category",
          "sources",
        ],
        properties: {
          id: { type: "string" },
          headline: {
            type: "string",
            description: "Concise headline, max 15 words",
          },
          executive_summary: {
            type: "string",
            description:
              "2-3 sentences. Factual only. Derived strictly from source content.",
          },
          why_it_matters: {
            type: "string",
            description:
              "1-2 sentences. Explicitly connect to business relevance: sourcing risk, shipping disruption, tariff exposure, fuel/commodity impact, consumer sentiment, or regulatory risk.",
          },
          category: {
            type: "string",
            enum: [
              "Tariffs",
              "Foreign Affairs",
              "Geography",
              "Supply Chain",
              "Retail",
              "AI",
              "Markets",
              "Regulation",
              "Consumer Trends",
              "General",
            ],
          },
          geopolitical_relevance: {
            type: ["string", "null"],
            description:
              "If geopolitically significant, describe which regions, trade routes, or shipping lanes are affected.",
          },
          sources: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["title", "url", "publisher"],
              properties: {
                title: { type: "string" },
                url: { type: "string" },
                publisher: { type: "string" },
              },
            },
          },
        },
      },
    },
    mode: {
      type: "string",
      enum: ["daily_debrief", "topic_brief"],
    },
    metadata: {
      type: "object",
      properties: {
        topic: { type: ["string", "null"] },
        date_from: { type: "string" },
        date_to: { type: "string" },
        total_articles_processed: { type: "number" },
        total_sources_used: { type: "number" },
        generated_at: { type: "string" },
      },
    },
  },
};

module.exports = { NEWSLETTER_SCHEMA };
