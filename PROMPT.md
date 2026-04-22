# Final Build Prompt

Build a locally runnable MVP today for an internal Costco executive news intelligence tool.

## High-level goal

Create a simple Costco-themed React application for internal executive use that helps leaders quickly understand important global developments without checking many sources manually.

## Branding and UI

- This is an internal tool for Costco executives.
- Use a Costco-themed visual style.
- You are authorized to use the Costco Wholesale logo for this internal tool.
- Keep the UI clean, executive-friendly, fast, and simple.
- The landing page should prominently say:
  - `Hi there, how can I help you today`

## Core user experience

- The primary input is free text.
- The user can type a topic they care about and select a date range.
- If the user enters a topic, generate a `Topic Brief` newsletter for that date range.
- If the user wants a broad overview, generate a `Daily Debrief` across all approved sources for that date range.
- At the top of the page, show an executive summary:
  - If no topic is selected, show a global executive summary of major world developments.
  - If a topic is selected, show a topic-specific executive summary.
- On the left side of the page, show helpful theme guidance based on the source universe and likely executive interests, such as:
  - Tariffs
  - Foreign Affairs
  - Geography
  - Supply Chain
  - Retail
  - AI
  - Markets
  - Regulation
  - Consumer Trends

## Geography and geopolitical intelligence behavior

- Costco operates in 44 countries, so this tool must be global in scope, not US-only.
- MVP should use English-language sources only.
- The tool should handle geography-sensitive and geopolitically sensitive topics well, including:
  - trade routes
  - shipping chokepoints
  - regional conflicts
  - sanctions
  - tariffs
  - diplomatic developments
  - supply chain disruption
- Example query types may include questions about places, regions, waterways, or conflict zones.
- If a user enters an ambiguous phrase such as a likely-mistyped geopolitical term, the system should:
  - avoid inventing facts
  - make a conservative best-effort interpretation only when confidence is reasonably high
  - clearly indicate when an interpretation is inferred
  - otherwise ask for clarification
- The summarization should explicitly connect geopolitical developments to business relevance when possible, such as:
  - sourcing risk
  - shipping disruption
  - tariff exposure
  - fuel and commodity impact
  - consumer sentiment

## Data and source requirements

- Use credible, live RSS feeds only for MVP.
- Do not use SerpApi in MVP.
- English-language sources only for MVP.
- Global coverage is required.
- Prioritize official RSS feeds and source transparency.
- Each newsletter must cite source URLs so executives can validate and read more.

## Starter source universe for MVP

- UPI
- CNBC Top News
- MarketWatch Top Stories
- Nasdaq RSS feeds
- New York Times
- BBC World
- BBC Business
- The Guardian World
- The Guardian Business
- France 24 English
- Nikkei Asia
- UN News English
- WTO News
- SEC RSS feeds
- Federal Reserve RSS feeds
- Retail Dive
- Supply Chain Dive
- TechCrunch AI
- MIT Technology Review AI

## Output requirements

- Generate a polished executive newsletter.
- Include at least 5 key insights.
- Each insight should include:
  - concise headline
  - short executive summary
  - why it matters
  - source URL or URLs
- The output should feel like an executive briefing, not a casual news digest.
- Support two modes clearly:
  - `Daily Debrief`
  - `Topic Brief`
- For topic mode, focus tightly on the requested subject and timeframe.
- For daily debrief mode, aggregate broadly across the approved source set for the selected date range.

## Actions and export

- The user must be able to export the generated newsletter as a PDF.
- The PDF should be ready to email.
- If full email sending is too much for the same-day MVP, implement PDF export first and structure the code so email can be added next.

## Product behavior

- Deduplicate overlapping stories across feeds.
- Filter by selected date range using article publication date.
- Prefer recency and source credibility.
- When many articles say the same thing, synthesize them into higher-level executive insights.
- Make it obvious which claims came from which sources.
- Preserve source links throughout the experience.

## Technical expectations

- Use React for the UI.
- Choose a practical backend or server layer to fetch and normalize RSS feeds.
- Keep architecture simple enough to run locally today.
- Provide a clean separation between:
  - UI
  - feed ingestion
  - filtering and ranking
  - newsletter synthesis
  - PDF export
- Include sensible loading, empty, and error states.
- Make the app usable on desktop and mobile, but optimize for desktop executives first.

## Deliverables

- Implement the MVP
- Make it runnable locally today
- Include setup and run instructions
- Include a short explanation of architecture and tradeoffs
- Identify anything mocked, deferred, or intentionally simplified

## MVP scope

- Free-text topic input
- Date range selector
- Daily Debrief mode
- Topic Brief mode
- Executive summary at top
- Left-side guided themes
- RSS-only ingestion from approved sources
- At least 5-insight newsletter output
- PDF export

## Backlog items

- Multilingual source support
- Admin-only UI for adding additional credible RSS sources
- User-managed source submissions with validation workflow
- SerpApi as optional future discovery fallback
- Email sending of exported PDF
- Saved brief history
- Personalization by executive role or region
- Geography and region filters
- Publisher/source management dashboard

## Important constraints

- This is an internal tool.
- Favor reliability, transparency, and speed over over-engineering.
- Do not invent unsupported facts; always cite sources.
- If a source is inaccessible or unstable, handle it gracefully and continue with remaining approved sources.
- If you need to make assumptions to finish today’s MVP, state them clearly.

## Final instructions

Please:

1. Summarize the final scope you are implementing.
2. Build the MVP.
3. Run it locally.
4. Verify the main flows.
5. Report what works, what is stubbed, and what should be next.
