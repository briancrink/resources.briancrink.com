# Feed lists

Source lists for **feed.briancrink.com**. Each folder is a topic; each `.txt` file inside is one platform.

```
feed/<topic>/<platform>.txt
```

The feed's GitHub Action reads the latest version of this folder every hour (no submodule update needed in feed.briancrink.com). The folder name becomes the topic filter on the page (`smart home` → "Smart Home", `ai` → "AI").

## Format

One entry per line. Blank lines and lines starting with `#` are ignored. Optional label: `Label | entry` (otherwise the feed's own title is used).

| File | What to put on each line | Example |
|---|---|---|
| `youtube.txt` | Channel handle or channel URL | `https://youtube.com/@9to5Mac` |
| `reddit.txt` | Subreddit, user, or URL | `r/homeassistant` · `u/name` |
| `web.txt` (or `websites.txt`, `rss.txt`) | Website or its RSS feed — the feed is found automatically | `theverge.com` · `9to5Mac | https://9to5mac.com/feed/` |
| `podcasts.txt` | Podcast RSS feed URL | `https://feeds.example.com/show.xml` |
| `bluesky.txt` | Handle or profile URL | `@name.bsky.social` |
| `mastodon.txt` | `@user@server` or profile URL | `@user@mastodon.social` |

`x.txt`, `threads.txt`, `instagram.txt` and `tiktok.txt` can be kept here for later, but they are skipped: those platforms have no free way to read posts.
