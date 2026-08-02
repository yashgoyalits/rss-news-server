export type FeedCategory = "markets" | "companies" | "industry";

export const VALID_CATEGORIES: ReadonlySet<FeedCategory> = new Set([
  "markets",
  "companies",
  "industry",
]);

export type FeedEntry = {
  url: string;
  limit: number;
};

export const RSS_FEEDS: Record<FeedCategory, FeedEntry[]> = {
  markets: [
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml", limit: 10 },
    { url: "https://feeds.marketwatch.com/marketwatch/topstories/", limit: 8 },
    { url: "https://finance.yahoo.com/news/rssindex", limit: 6 },
  ],
  companies: [
    { url: "https://feeds.reuters.com/reuters/technologyNews", limit: 10 },
    { url: "https://techcrunch.com/feed/", limit: 10 },
  ],
  industry: [
    { url: "https://www.wired.com/feed/rss", limit: 8 },
    { url: "https://feeds.arstechnica.com/arstechnica/index", limit: 8 },
  ],
};
