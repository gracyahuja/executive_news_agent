const Anthropic = require("@anthropic-ai/sdk");
const { CLAUDE_SYSTEM_PROMPT, CLAUDE_USER_PROMPT } = require("../config/prompts");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CLAUDE_MODEL = "claude-sonnet-4-6";

/**
 * Use Claude Sonnet 4.6 as the executive editor.
 * Receives the GPT-produced structured JSON and refines clarity and tone.
 * Never adds facts; only improves language.
 * Returns the refined newsletter object.
 */
async function refineNewsletter(newsletterJson) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      "[Claude] ANTHROPIC_API_KEY not set — skipping refinement step, returning GPT draft as-is."
    );
    return { ...newsletterJson, _refined: false };
  }

  const userPrompt = CLAUDE_USER_PROMPT(newsletterJson);

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: CLAUDE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const raw = message.content?.[0]?.text;
  if (!raw) throw new Error("Claude returned empty response");

  let parsed;
  try {
    // Strip markdown code fences if Claude wraps it despite instructions
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.warn(
      "[Claude] Could not parse refined JSON, falling back to GPT draft:",
      e.message
    );
    return { ...newsletterJson, _refined: false };
  }

  // Preserve metadata and mode from GPT step — Claude should not alter these
  parsed.metadata = newsletterJson.metadata;
  parsed.mode = newsletterJson.mode;
  parsed._refined = true;

  return parsed;
}

module.exports = { refineNewsletter };
