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
    { url: "https://www.livemint.com/rss/markets", limit: 25 },
    { url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", limit: 25 },
    { url: "https://www.thehindubusinessline.com/markets/?service=rss", limit: 25 },
  ],
  companies: [
    { url: "https://www.thehindubusinessline.com/companies/?service=rss", limit: 25 },
    { url: "https://www.livemint.com/rss/companies", limit: 25 },
  ],
  industry: [
    { url: "https://economictimes.indiatimes.com/news/industry/rssfeeds/13352306.cms", limit: 15 },
    { url: "https://www.business-standard.com/rss/industry-217.rss", limit: 15 },
  ],
};
