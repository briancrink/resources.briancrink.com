# Social bar

A reusable social media icon bar for any website. Two script tags. Circle icons. Nothing in the component is tied to one brand: links, labels and colors all come from your `config.js`. Desktop and mobile each get their own position (an edge, a corner, or center) and layout.

Hovering with a mouse uses a small spring: the icon under the pointer grows, squashes like jelly, then settles, and its neighbors grow a little, like the macOS dock. This works at any window width. On touch screens, slide a finger along the open bar to get the same effect, then lift your finger to open the icon underneath it. On phones the icons start folded into a small **stack**, like a deck of cards: one icon in front, the rest peeking out around it. Tap it and it opens into the bar. By default there's no background behind the icons; you can turn on a dock (see **Dock** below).

## Add it to any page

1. Put the `social-bar` folder in your site (or in a shared repo you add as a git submodule).
2. Create a `config.js` with your brand's details. This is the only file with anything brand-specific in it:

```js
window.SocialBarConfig = {
  desktop: { position: "right",  align: "center" },
  mobile:  { position: "bottom", align: "center" },

  border: "darker",
  tooltip: { color: "#ffffff", background: "#1e293b" },

  icons: {
    instagram: { url: "https://www.instagram.com/yourbrand/", label: "@yourbrand" },
    x:         { url: "https://x.com/yourbrand",              label: "@yourbrand" },
    threads:   { url: "https://www.threads.net/@yourbrand",   label: "@yourbrand", show: "desktop" },
    facebook:  { url: "https://www.facebook.com/yourbrand",   label: "Your Brand" },
    email:     { url: "mailto:hello@example.com",              label: "hello@example.com" },
    rss:       { url: "/feed.xml",                             label: "RSS feed" },
    discord:   { url: "https://discord.gg/yourserver",         label: "Join our Discord" },
  },
};
```

3. Load both files before `</body>`, config first:

```html
<script src="social-bar/config.js" defer></script>
<script src="social-bar/social-bar.js" defer></script>
```

Scripts marked `defer` run in the order they appear, so the config is always ready when the bar starts. The bar finds its stylesheet (`social-bar.css`) next to its script automatically.

**Paths:** a relative `src` like `social-bar/config.js` is resolved from the page's own folder, so a page in a subfolder needs `../social-bar/...`. Paths that start with `/` (for example `/social-bar/config.js`) work from any page. The same goes for relative `url` values in the config, such as an RSS feed.

## Turning icons on or off

The component ships with **no links**. An icon appears once your config gives it a `url`, so only the networks you list show up. The available icons are `instagram`, `x`, `threads`, `facebook`, `email`, `message`, `rss` and `discord`.

To hide an icon that has a url, or show it on one device only, use `show`:

```js
icons: {
  rss:     { url: "/feed.xml", show: true },
  discord: { url: "https://discord.gg/yourserver", show: false },
  threads: { url: "https://www.threads.net/@yourbrand", show: "desktop" },
  message: { url: "sms:+15555550100", show: "mobile" },
}
```

| `show` value | Result |
|---|---|
| `true` (or leave it out) | Shown on desktop and mobile |
| `false` | Hidden everywhere |
| `"desktop"` | Desktop only |
| `"mobile"` | Mobile only |

An icon with no `url`, or an empty one (`url: ""`), is always hidden.

With `data-*` attributes on the script tag: `data-rss-show="false"` hides RSS and `data-rss-show="true"` shows it.

## Placement: desktop and mobile set separately

| Option | Values | Default |
|---|---|---|
| `desktop.position` | `left`, `right`, `top`, `bottom`, `center`, or a corner: `top-left`, `top-right`, `bottom-left`, `bottom-right` | `right` |
| `desktop.align` | `start`, `center`, `end` | `center` |
| `mobile.position` | `left`, `right`, `top`, `bottom`, `center`, or a corner: `top-left`, `top-right`, `bottom-left`, `bottom-right` | `bottom` |
| `mobile.align` | `start`, `center`, `end` | `center` |
| `breakpoint` | screen width in px; at or below it the mobile settings apply | `760` |

- `position` is the edge of the screen the bar sticks to. `left` and `right` stack the icons in a column. `top` and `bottom` lay them out in a row.
- `center` is shorthand for a centered row at the bottom (`position: "bottom"`, `align: "center"`).
- `align` sets where the bar sits along that edge. On `left` or `right`, `start` is the top and `end` is the bottom. On `top` or `bottom`, `start` is the left and `end` is the right.

Examples:

```json
"desktop": { "position": "left" },
"mobile":  { "position": "bottom" }
```

```json
"desktop": { "position": "bottom", "align": "end" },
"mobile":  { "position": "top" }
```

To use the same position everywhere, write `"position": "left"`.

### Corners

Put the bar in a corner with `top-left`, `top-right`, `bottom-left` or `bottom-right`:

```json
"desktop": { "position": "top-left" },
"mobile":  { "position": "top-left" }
```

You can also name the two edges separately. These all mean the top-left corner:

```json
"position": "top-left"
"position": "top left"
"position": ["top", "left"]
"position": "top", "align": "left"
```

In a corner, the icons always form a column down (or up) that side of the screen, never a row across it. A corner sets the alignment itself, so any `align` value is ignored.

Corners work with both layouts:

- **Bar (desktop default):** the column starts in the corner. From a top corner it runs down the side; from a bottom corner it runs up.
- **Stack (mobile default):** the folded stack sits in the corner and opens into that column, downward from a top corner and upward from a bottom corner.

Phone in the top-left corner as a stack, desktop in the bottom-right as a bar:

```json
"desktop": { "position": "bottom-right" },
"mobile":  { "position": "top-left" }
```

Desktop as a stack in the corner too:

```json
"desktop": { "position": "top-left", "layout": "stack" }
```

## Layout: bar or stack

Each device can use one of two layouts:

- **`"bar"`**: every icon is visible in a row or column.
- **`"stack"`**: the icons fold into one small deck. The first icon is on top, and the others peek out around it in a loose ring, like a casually stacked deck.

| Option | Values | Default |
|---|---|---|
| `desktop.layout` | `"bar"` or `"stack"` | `"bar"` |
| `mobile.layout` | `"bar"` or `"stack"` | `"stack"` |
| `stackTimeout` | seconds of inactivity before an opened stack folds back up on touch screens | `5` |

```json
"desktop": { "position": "right",  "layout": "bar" },
"mobile":  { "position": "bottom", "layout": "stack" }
```

To use the same layout on both, write `"layout": "stack"` or `"layout": "bar"` at the top level.

How the stack behaves:

- **Mouse (desktop):** hovering over the stack opens it into the bar. Moving the pointer away folds it back up.
- **Touch (phones and tablets):** tapping the top icon opens the bar instead of following the link. Then tap an icon, or slide your finger along the bar and lift it on the icon you want. The bar folds back after `stackTimeout` seconds without a touch, or as soon as you tap somewhere else on the page.
- **Keyboard:** tabbing into the stack opens it, and tabbing out closes it.

The top icon of the stack is the first icon in the bar. Use `order` to choose it, e.g. `"order": ["instagram", "facebook", "x"]` puts Instagram on top, with Facebook and X closest behind it.

The stack sits where the bar's `align` point is (center by default) and opens out along the same edge.

With `data-*` attributes on the script tag: `data-layout="stack"`, `data-layout-desktop="bar"`, `data-layout-mobile="stack"`, `data-stack-timeout="8"`.

## Icons

Available icons: `instagram`, `x`, `threads`, `facebook`, `email`, `message`, `rss`, `discord`.

Each one under `"icons"` accepts:

| Field | What it does |
|---|---|
| `url` | Link target. `https://`, `mailto:`, `sms:`, `tel:`, or a relative path like `/feed.xml`. An empty string hides the icon. `javascript:` URLs are ignored. |
| `label` | The tooltip text and screen-reader name, such as `@yourbrand`. Without one, the network's name is used ("Instagram", "Email", ...). |
| `border` | Border color for this icon (see below). Overrides the global `border`. |
| `show` | `true` (default), `false`, `"desktop"` (desktop only), or `"mobile"` (mobile only). |
| `color` | Optional. Replaces the icon's fill color, for example `"#2a9d8f"`. The email icon defaults to a neutral slate, so this is how you give it your brand color. |
| `tooltip` | Optional. Tooltip colors for this icon only, e.g. `{ color: "#000", background: "#ffd400" }`. Overrides the global `tooltip`. |

A short form also works: `x: "https://x.com/yourbrand"` sets just the URL.

Icons you leave out don't appear (see **Turning icons on or off** above). Use `"order": ["email", "instagram", "facebook"]` to change the order. Icons you don't list stay in their usual order after the ones you do.

## Tooltip colors

On desktop, hovering an icon shows its `label` in a small tooltip ("tag"). Set its text and background colors once for all icons:

```js
tooltip: { color: "#ffffff", background: "#1e293b" }
```

| Field | Values | Default |
|---|---|---|
| `color` | text color, any CSS color | `"#ffffff"` |
| `background` | background, any CSS color | `"#222222"` |

To give one icon different colors, put `tooltip` inside that icon (see **Icons** above).

With `data-*` attributes on the script tag: `data-tooltip-color="#ffffff"` and `data-tooltip-background="#1e293b"`.

Tooltips appear only with a mouse, and not while a stack is folded. Phones don't show them.

## Dock (background behind the icons)

By default there's no dock, just the icons. To show one:

```json
"dock": { "show": true, "color": "#ffffff", "opacity": 0.9 }
```

| Field | Values | Default |
|---|---|---|
| `show` | `true` / `false` | `false` |
| `color` | any CSS color, e.g. `"#ffffff"`, `"#1e293b"`, `"black"` | `"#ffffff"` |
| `opacity` | `0` (fully see-through) to `1` (solid), or a percentage like `"80%"` | `0.92` |
| `blur` | `true` blurs the page behind a see-through dock (frosted glass), `false` turns that off | `true` |

The top-level `dock` applies to desktop and mobile. To set one device only, put `dock` inside `desktop` or `mobile`:

```json
"desktop": { "position": "left" },
"mobile":  { "position": "bottom", "dock": { "show": true, "color": "#1e293b", "opacity": 0.6 } }
```

Short forms: `"dock": true` turns it on with the default color, and `"dock": false` turns it off.

With `data-*` attributes on the script tag: `data-dock="true"`, `data-dock-color="#1e293b"`, `data-dock-opacity="0.6"`, `data-dock-blur="false"`, or `data-dock-mobile="true"` for mobile only.

## Border color

Set it once for every icon with `"border"`, or per icon inside `"icons"`:

| Value | Result |
|---|---|
| `"darker"` (default) | A slightly darker shade of each icon's own color |
| `"lighter"` | A slightly lighter shade of each icon's own color |
| `"black"` | Black |
| `"white"` | White |
| `"none"` | No border |
| any CSS color | Used as-is, e.g. `"#ffcc00"` or `"rgb(0 0 0 / .4)"` |

`borderWidth` sets the border thickness in pixels (default `2`).

`darker` and `lighter` follow each icon's color, so Facebook gets a deeper blue ring and RSS a deeper orange ring. X and Threads are nearly black, so `darker` barely shows on them. Use `lighter` or `white` on those two if you need the ring to show.

## Other ways to configure

Settings are applied in this order, and later ones win: script defaults → a JSON block on the page → `window.SocialBarConfig` (your `config.js`) → `data-*` attributes on the script tag.

`data-*` attributes are handy for a one-off change on a single page, such as a different position, while every other page keeps using the shared `config.js`.

`data-*` attributes, for quick one-off overrides:

```html
<script
  src="social-bar/social-bar.js"
  defer
  data-position-desktop="left"
  data-position-mobile="bottom"
  data-border="white"
  data-instagram="https://instagram.com/yourbrand"
  data-instagram-label="@yourbrand"
  data-instagram-border="black"
  data-rss-show="false"
></script>
```

Instead of `config.js`, the settings can also go in a JSON block on the page (JSON syntax: quoted keys, no trailing commas):

```html
<script type="application/json" id="social-bar-config">
{ "desktop": { "position": "left" },
  "icons": { "x": { "url": "https://x.com/yourbrand", "label": "@yourbrand" } } }
</script>
```

If that block isn't valid JSON, the browser console shows `#social-bar-config is not valid JSON` and the block is ignored.

Older configs keep working: `"side": "left"` (desktop position), `"links": { "instagram": "…" }`, and `"labels": { "instagram": "…" }`.

## Other options

| Option | Default | What it does |
|---|---|---|
| `zIndex` | `70` | Stacking level of the bar |
| `css` | next to the script | URL of the stylesheet, if you host it elsewhere |

## Script API

```js
SocialBar.setPosition({ desktop: "left", mobile: "bottom" });
SocialBar.open();     // open a stack into the bar
SocialBar.close();    // fold it back up
SocialBar.config();   // the config currently in effect
SocialBar.destroy();
SocialBar.mount();
```

Add `data-manual="true"` to the script tag to stop it from mounting by itself.

## Notes

- If the bar is at the bottom on phones, give the page some bottom padding there so the last line isn't covered. The bar never changes the page layout itself.
- The bar stays hidden until its stylesheet has loaded, so unstyled icons never flash on the screen.
- To see the mobile layout on a computer, make the browser window narrower than the `breakpoint` (760px by default).
