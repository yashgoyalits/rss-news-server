import type { FeedCategory } from "../config/feeds.config";
import { RSS_FEEDS } from "../config/feeds.config";
import type { NormalizedStory } from "../types/rss";
import { parseFeed } from "../utils/parse-rss";

const FETCH_HEADERS = {
  "User-Agent": "rss-worker/1.0 (+node-server)",
  Accept:
    "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9",
};

async function fetchOneFeed(
  url: string,
  limit: number,
): Promise<NormalizedStory[]> {
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) {
    throw new Error(`Feed ${url} responded ${res.status}`);
  }
  return parseFeed(await res.text(), url, limit);
}

export async function getStoriesByCategory(
  category: FeedCategory,
): Promise<NormalizedStory[]> {
  const entries = RSS_FEEDS[category];

  const settled = await Promise.allSettled(
    entries.map((entry) => fetchOneFeed(entry.url, entry.limit)),
  );

  const flat = settled
    .filter(
      (r): r is PromiseFulfilledResult<NormalizedStory[]> =>
        r.status === "fulfilled",
    )
    .flatMap((r) => r.value);

  const seen = new Set<string>();
  const unique = flat.filter((s) => {
    if (!s.url || seen.has(s.url)) return false;
    seen.add(s.url);
    return true;
  });

  return unique
    .map((s) => ({ s, t: Date.parse(s.date) }))
    .sort((a, b) => b.t - a.t)
    .map(({ s }) => s);
}
