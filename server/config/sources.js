/**
 * Approved RSS source universe for the Costco Executive News Agent.
 * All sources are English-language, credible, and globally scoped.
 * Add/remove sources here to update the feed universe.
 */

const SOURCES = [
  {
    id: "upi",
    name: "UPI",
    url: "https://rss.upi.com/news/topnews.rss",
    category: "General",
    region: "Global",
  },
  {
    id: "cnbc",
    name: "CNBC Top News",
    url: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    category: "Markets",
    region: "US",
  },
  {
    id: "marketwatch",
    name: "MarketWatch Top Stories",
    url: "https://feeds.marketwatch.com/marketwatch/topstories/",
    category: "Markets",
    region: "US",
  },
  {
    id: "nasdaq",
    name: "Nasdaq",
    url: "https://www.nasdaq.com/feed/rssoutbound?category=Markets",
    category: "Markets",
    region: "US",
  },
  {
    id: "nyt",
    name: "New York Times",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    category: "General",
    region: "US",
  },
  {
    id: "bbc_world",
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    category: "General",
    region: "Global",
  },
  {
    id: "bbc_business",
    name: "BBC Business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    category: "Business",
    region: "Global",
  },
  {
    id: "guardian_world",
    name: "The Guardian World",
    url: "https://www.theguardian.com/world/rss",
    category: "General",
    region: "Global",
  },
  {
    id: "guardian_business",
    name: "The Guardian Business",
    url: "https://www.theguardian.com/uk/business/rss",
    category: "Business",
    region: "Global",
  },
  {
    id: "france24",
    name: "France 24 English",
    url: "https://www.france24.com/en/rss",
    category: "General",
    region: "Global",
  },
  {
    id: "nikkei",
    name: "Nikkei Asia",
    url: "https://asia.nikkei.com/rss/feed/nar",
    category: "Business",
    region: "Asia",
  },
  {
    id: "un_news",
    name: "UN News English",
    url: "https://news.un.org/feed/subscribe/en/news/topic/peace-and-security/rss.xml",
    category: "Foreign Affairs",
    region: "Global",
  },
  {
    id: "wto",
    name: "WTO News",
    url: "https://www.wto.org/english/news_e/news_rss_e.htm",
    category: "Tariffs",
    region: "Global",
  },
  {
    id: "sec",
    name: "SEC Press Releases",
    url: "https://www.sec.gov/rss/news/press-releases.xml",
    category: "Regulation",
    region: "US",
  },
  {
    id: "fed",
    name: "Federal Reserve",
    url: "https://www.federalreserve.gov/feeds/press_all.xml",
    category: "Markets",
    region: "US",
  },
  {
    id: "retail_dive",
    name: "Retail Dive",
    url: "https://www.retaildive.com/feeds/news/",
    category: "Retail",
    region: "US",
  },
  {
    id: "supply_chain_dive",
    name: "Supply Chain Dive",
    url: "https://www.supplychaindive.com/feeds/news/",
    category: "Supply Chain",
    region: "Global",
  },
  {
    id: "techcrunch_ai",
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "AI",
    region: "Global",
  },
  {
    id: "mit_tech",
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    category: "AI",
    region: "Global",
  },
];

const THEME_CATEGORIES = [
  { id: "tariffs", label: "Tariffs", icon: "⚖️" },
  { id: "foreign_affairs", label: "Foreign Affairs", icon: "🌐" },
  { id: "geography", label: "Geography", icon: "🗺️" },
  { id: "supply_chain", label: "Supply Chain", icon: "🚢" },
  { id: "retail", label: "Retail", icon: "🛒" },
  { id: "ai", label: "AI", icon: "🤖" },
  { id: "markets", label: "Markets", icon: "📈" },
  { id: "regulation", label: "Regulation", icon: "📋" },
  { id: "consumer_trends", label: "Consumer Trends", icon: "👥" },
];

module.exports = { SOURCES, THEME_CATEGORIES };
