const OpenAI = require("openai");
const { NEWSLETTER_SCHEMA } = require("../config/schema");
const { GPT_SYSTEM_PROMPT, GPT_USER_PROMPT } = require("../config/prompts");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || "gpt-4o";

/**
 * Use GPT to normalize, filter, cluster, and extract structured newsletter JSON.
 * Returns a newsletter object matching NEWSLETTER_SCHEMA.
 */
async function extractNewsletter({ articles, mode, topic, dateFrom, dateTo }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to server/.env to enable GPT extraction."
    );
  }

  // Cap at 80 articles to stay within token limits; prefer recent articles
  const sorted = [...articles].sort((a, b) => {
    if (!a.pubDate) return 1;
    if (!b.pubDate) return -1;
    return new Date(b.pubDate) - new Date(a.pubDate);
  });
  const batch = sorted.slice(0, 80);

  const userPrompt = GPT_USER_PROMPT(mode, topic, dateFrom, dateTo, batch);

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: GPT_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1, // low temperature for factual extraction
    max_tokens: 4096,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("GPT returned empty response");

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`GPT returned invalid JSON: ${e.message}`);
  }

  // Enforce metadata
  parsed.metadata = {
    topic: topic || null,
    date_from: dateFrom,
    date_to: dateTo,
    total_articles_processed: batch.length,
    total_sources_used: new Set(batch.map((a) => a.sourceId)).size,
    generated_at: new Date().toISOString(),
  };
  parsed.mode = mode;

  return parsed;
}

module.exports = { extractNewsletter };
