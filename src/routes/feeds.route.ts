import { Hono } from "hono";
import { RSS_FEEDS } from "../config/feeds.config";

const feeds = new Hono();

feeds.get("/", (c) => c.json(RSS_FEEDS));

export default feeds;
