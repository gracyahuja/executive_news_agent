# Costco Executive News Intelligence — MVP

Internal tool for Costco executives to quickly understand global developments across 19 approved credible sources.

---

## Quick Start

### Prerequisites
- Node.js 18+ (installed via `brew install node` on macOS)
- OpenAI API key (required for GPT extraction step)
- Anthropic API key (recommended for Claude refinement; optional — GPT draft is used if absent)

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure API keys

```bash
# Open server/.env and fill in your keys
nano server/.env
```

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o          # or any OpenAI model you have access to
ANTHROPIC_API_KEY=sk-ant-... # optional but recommended
PORT=3001
```

### 3. Run the app

```bash
npm run dev
```

This starts:
- **Backend** on `http://localhost:3001`
- **Frontend** on `http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## Usage

### Daily Debrief
Click **Daily Debrief** without entering a topic. The system fetches all 19 approved sources for the selected date range, clusters the most important stories, and produces a broad executive briefing.

### Topic Brief
Enter a topic (e.g., "Red Sea shipping disruption", "China tariffs", "EU AI regulation") and click **Topic Brief**. The system filters to the most relevant articles for that topic and produces a focused executive brief.

### Guided themes
Click any theme in the left sidebar (Tariffs, Foreign Affairs, Supply Chain, etc.) to pre-fill the search box.

### PDF Export
After generating a brief, click **Export PDF** to download a print-ready PDF.

---

## Architecture

```
costco_exec_news_agent/
├── server/                    Node.js/Express backend
│   ├── server.js              Entry point
│   ├── config/
│   │   ├── sources.js         All 19 approved RSS sources (single source of truth)
│   │   ├── prompts.js         GPT and Claude prompt templates
│   │   └── schema.js          JSON schema for structured newsletter extraction
│   ├── services/
│   │   ├── rssService.js      RSS ingestion (rss-parser, parallel fetch, graceful failures)
│   │   ├── gptService.js      GPT extraction: filter → cluster → structured JSON
│   │   ├── claudeService.js   Claude Sonnet 4.6 editorial refinement
│   │   └── newsletterService.js   Pipeline orchestration
│   └── routes/
│       └── api.js             REST endpoints
└── client/                    React + Vite + Tailwind frontend
    └── src/
        ├── App.jsx            Main app shell + state machine
        ├── api/client.js      API layer
        ├── utils/pdf.js       jsPDF + html2canvas export
        └── components/
            ├── Header.jsx     Costco-branded header
            ├── Sidebar.jsx    Left-side guided themes
            ├── SearchPanel.jsx  Topic input + date range + mode buttons
            ├── ExecutiveSummary.jsx  Top-level summary card
            ├── Newsletter.jsx   Newsletter container + PDF export trigger
            ├── Insight.jsx      Individual insight card
            ├── LoadingState.jsx Animated pipeline progress
            ├── LandingState.jsx Welcome + example queries
            └── ErrorState.jsx   Error display + API key guidance
```

### Pipeline

```
User request
  → RSS ingestion (19 sources, parallel, graceful per-source failure)
  → Date range filter
  → GPT-4o: normalize, cluster, extract structured facts into JSON
  → Claude Sonnet 4.6: editorial refinement (tone + clarity, fact-locked)
  → JSON response to client
  → React renders newsletter
  → PDF export via jsPDF + html2canvas
```

### Key design decisions

| Decision | Rationale |
|---|---|
| Express + Vite (not Next.js) | Simpler separation of concerns; faster local setup |
| rss-parser | Battle-tested; handles most feed encodings |
| `response_format: json_object` (GPT) | Forces structured output; eliminates parse failures |
| Claude as tone editor only | Accuracy over eloquence; Claude cannot add facts |
| Per-source error handling | One bad feed never blocks the rest |
| jsPDF + html2canvas | No server-side PDF dep (no puppeteer); client-side export |
| `temperature: 0.1` on GPT | Low temperature for factual extraction |

---

## Model notes

- **"GPT-5.4"** specified in the product brief is not a known OpenAI API model name. Default is `gpt-4o`. Set `OPENAI_MODEL` in `server/.env` to any model you have access to (e.g., `gpt-4-turbo`, `gpt-4o-mini`).
- **Claude Sonnet 4.6** is used as the second-pass editor. If `ANTHROPIC_API_KEY` is absent, the GPT draft is served directly with a UI notice.

---

## Source universe (19 sources)

| Source | Category | Region |
|---|---|---|
| UPI | General | Global |
| CNBC Top News | Markets | US |
| MarketWatch | Markets | US |
| Nasdaq | Markets | US |
| New York Times | General | US |
| BBC World | General | Global |
| BBC Business | Business | Global |
| The Guardian World | General | Global |
| The Guardian Business | Business | Global |
| France 24 English | General | Global |
| Nikkei Asia | Business | Asia |
| UN News English | Foreign Affairs | Global |
| WTO News | Tariffs | Global |
| SEC Press Releases | Regulation | US |
| Federal Reserve | Markets | US |
| Retail Dive | Retail | US |
| Supply Chain Dive | Supply Chain | Global |
| TechCrunch AI | AI | Global |
| MIT Technology Review | AI | Global |

---

## What is implemented

- [x] Free-text topic input
- [x] Date range selector with quick shortcuts
- [x] Daily Debrief mode
- [x] Topic Brief mode
- [x] Left-side guided themes (9 categories)
- [x] Executive summary at top
- [x] RSS-only ingestion (19 approved sources)
- [x] 5+ insight newsletter output with headlines, summaries, why-it-matters, citations
- [x] PDF export (client-side, print-ready)
- [x] Costco branding (red/blue/white)
- [x] Loading state with pipeline step animation
- [x] Per-feed error handling (failed feeds noted in UI)
- [x] Category filter on newsletter output
- [x] Geopolitical context field per insight

## What is mocked / simplified

- **PDF header**: Uses a simple text-based Costco wordmark. Replace with the actual SVG/PNG logo in `Header.jsx`.
- **GPT model name**: Using `gpt-4o` (spec said "GPT-5.4" which is not a valid API model name).
- **No auth**: No login or user management — single shared tool. Add auth middleware if needed.
- **No persistent history**: Each generation is stateless. Brief history is a backlog item.

## Backlog items

- [ ] Email sending of exported PDF
- [ ] Saved brief history
- [ ] Personalization by executive role or region
- [ ] Multilingual source support (currently English only)
- [ ] Admin UI for adding/validating RSS sources
- [ ] Geography and region filters
- [ ] Optional Gemini-based live-web corroboration
- [ ] SerpApi as optional discovery fallback
- [ ] Publisher/source management dashboard
