import { XMLParser } from "fast-xml-parser";
import type { NormalizedStory } from "../types/rss";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (tagName) => tagName === "item" || tagName === "entry",
});

function extractLink(link: unknown): string {
  if (typeof link === "string") return link.trim();
  if (Array.isArray(link)) {
    const alt = (link as Record<string, string>[]).find(
      (l) => l["@_rel"] === "alternate" || !l["@_rel"],
    );
    return alt?.["@_href"] ?? "";
  }
  if (typeof link === "object" && link !== null) {
    return ((link as Record<string, string>)["@_href"] ?? "").trim();
  }
  return "";
}

function extractText(field: unknown): string {
  if (typeof field === "string") return field;
  if (typeof field === "object" && field !== null) {
    return (((field as Record<string, unknown>)["#text"] as string) ?? "");
  }
  return "";
}

function stripHtml(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanContent(field: unknown): string {
  return stripHtml(extractText(field)).slice(0, 300);
}

function hostnameOf(url: string): string {
  try { return new URL(url).hostname; }
  catch { return url; }
}

export function parseFeed(
  xml: string,
  feedUrl: string,
  limit: number,
): NormalizedStory[] {
  let doc: Record<string, unknown>;
  try {
    doc = parser.parse(xml) as Record<string, unknown>;
  } catch (e) {
    throw new Error(`XML parse error for ${feedUrl}: ${String(e)}`);
  }

  // ── RSS 2.0 ──────────────────────────────────────────────────────────────
  const rss = doc.rss as Record<string, unknown> | undefined;
  if (rss?.channel) {
    const ch = rss.channel as Record<string, unknown>;
    const source = extractText(ch.title) || hostnameOf(feedUrl);
    const items = ((ch.item as Record<string, unknown>[]) ?? []).slice(0, limit);

    return items.map((item) => ({
      title: extractText(item.title),
      url: extractLink(item.link),
      content: cleanContent(item["content:encoded"] ?? item.description),
      date: extractText(item.pubDate ?? item["dc:date"]),
      source,
    }));
  }

  // ── Atom ─────────────────────────────────────────────────────────────────
  const feed = doc.feed as Record<string, unknown> | undefined;
  if (feed) {
    const source = extractText(feed.title) || hostnameOf(feedUrl);
    const entries = ((feed.entry as Record<string, unknown>[]) ?? []).slice(0, limit);

    return entries.map((entry) => ({
      title: extractText(entry.title),
      url: extractLink(entry.link),
      content: cleanContent(entry.content ?? entry.summary),
      date: extractText(entry.published ?? entry.updated),
      source,
    }));
  }

  return [];
}
