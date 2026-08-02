import { Hono } from "hono";
import { VALID_CATEGORIES, type FeedCategory } from "../config/feeds.config";
import { getStoriesByCategory } from "../services/rss.service";

const stories = new Hono();

stories.get("/", async (c) => {
  const raw = c.req.query("keyword");

  const keyword: FeedCategory =
    raw && VALID_CATEGORIES.has(raw as FeedCategory)
      ? (raw as FeedCategory)
      : "markets";

  const data = await getStoriesByCategory(keyword);
  return c.json(data);
});

export default stories;
