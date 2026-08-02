import { Hono } from "hono";
import feeds from "./routes/feeds.route";
import stories from "./routes/stories.route";

const app = new Hono();

app.route("/api/feeds", feeds);
app.route("/api/stories", stories);

app.notFound((c) =>
  c.json(
    { error: "Use /api/feeds or /api/stories?keyword=markets|companies|industry" },
    404,
  ),
);

app.onError((err, c) => {
  console.error(err);
  const message = err instanceof Error ? err.message : "Unknown error";
  return c.json({ error: message }, 500);
});

export default app;
