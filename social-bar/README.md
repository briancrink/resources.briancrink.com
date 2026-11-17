# briancrink social bar

One script tag. Circle icons. Desktop and mobile each get their own position (left, right, top, bottom, or center).

Hovering with a mouse uses a small spring: the icon under the pointer grows, squashes like jelly, then settles, and its neighbors grow a little, like the macOS dock. This works at any window width. On touch screens, slide a finger along the open bar to get the same effect, then lift your finger to open the icon underneath it. On phones the icons start folded into a small **stack**, like a deck of cards: one icon in front, the rest peeking out around it. Tap it and it opens into the bar. By default there's no background behind the icons; you can turn on a dock (see **Dock** below).

## Add it to any page

Put this folder in the site (or add the repo as a git submodule named `social-bar`), then add this before `</body>`:

```html
<script type="application/json" id="lp-social-config">
{
  "desktop": { "position": "left",  "align": "center" },
  "mobile":  { "position": "bottom", "align": "center" },

  "border": "darker",
  "borderWidth": 2,

  "icons": {
    "instagram": { "url": "https://www.instagram.com/yourclinic/", "label": "@yourclinic" },
    "x":         { "url": "https://x.com/yourclinic",              "label": "@yourclinic" },
    "threads":   { "url": "https://www.threads.net/@yourclinic",   "label": "@yourclinic", "show": "desktop" },
    "facebook":  { "url": "https://www.facebook.com/yourclinic",   "label": "Your Clinic", "border": "lighter" },
    "email":     { "url": "mailto:hello@yourclinic.org",            "label": "hello@yourclinic.org" },
    "message":   { "url": "sms:+16165550100",                       "label": "Text us" },
    "rss":       { "url": "/feed.xml",                       "label": "RSS feed", "show": true },
    "discord":   { "url": "https://discord.gg/yourserver",          "label": "Join our Discord", "border": "#ffffff" }
  }
}
</script>
<script src="social-bar/social-bar.js" defer></script>
```

The config block can go anywhere on the page. The script reads it after the page has loaded.

## Turning icons on or off

All eight icons are **on by default**: `instagram`, `x`, `threads`, `facebook`, `email`, `message`, `rss`, `discord`. Each one uses the URL and label stored in the script until you override it.

Use `show` on any icon:

```json
"icons": {
  "rss":     { "show": true },
  "discord": { "show": false },
  "threads": { "show": "desktop" },
  "message": { "show": "mobile" }
}
```

| `show` value | Result |
|---|---|
| `true` (or leave it out) | Shown on desktop and mobile |
| `false` | Hidden everywhere |
| `"desktop"` | Desktop only |
| `"mobile"` | Mobile only |

An icon also hides if its `url` is an empty string (`"url": ""`).

**RSS:** it is on by default and points to `/feed.xml`. To point it somewhere else, set its URL:

```json
"rss": { "url": "/blog/feed.xml", "label": "RSS feed" }
```

To turn it off, use `"rss": { "show": false }`.

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
| `label` | The tooltip text and screen-reader name, such as `@yourclinic`. |
| `border` | Border color for this icon (see below). Overrides the global `border`. |
| `show` | `true` (default), `false`, `"desktop"` (desktop only), or `"mobile"` (mobile only). |
| `color` | Optional. Replaces the icon's fill color, for example `"#2a9d8f"`. |

A short form also works: `"x": "https://x.com/yourclinic"` sets just the URL.

Icons you leave out keep the defaults in the script file and stay on (see **Turning icons on or off** above). Use `"order": ["email", "instagram", "facebook"]` to change the order. Icons you don't list stay in their usual order after the ones you do.

## Dock (background behind the icons)

By default there's no dock, just the icons. To show one:

```json
"dock": { "show": true, "color": "#ffffff", "opacity": 0.9 }
```

| Field | Values | Default |
|---|---|---|
| `show` | `true` / `false` | `false` |
| `color` | any CSS color, e.g. `"#ffffff"`, `"#12304a"`, `"black"` | `"#ffffff"` |
| `opacity` | `0` (fully see-through) to `1` (solid), or a percentage like `"80%"` | `0.92` |
| `blur` | `true` blurs the page behind a see-through dock (frosted glass), `false` turns that off | `true` |

The top-level `dock` applies to desktop and mobile. To set one device only, put `dock` inside `desktop` or `mobile`:

```json
"desktop": { "position": "left" },
"mobile":  { "position": "bottom", "dock": { "show": true, "color": "#12304a", "opacity": 0.6 } }
```

Short forms: `"dock": true` turns it on with the default color, and `"dock": false` turns it off.

With `data-*` attributes on the script tag: `data-dock="true"`, `data-dock-color="#12304a"`, `data-dock-opacity="0.6"`, `data-dock-blur="false"`, or `data-dock-mobile="true"` for mobile only.

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

Settings are applied in this order, and later ones win: script defaults → the JSON block → `window.briancrinkSocial` → `data-*` attributes on the script tag.

`data-*` attributes, for quick one-off overrides:

```html
<script
  src="social-bar/social-bar.js"
  defer
  data-position-desktop="left"
  data-position-mobile="bottom"
  data-border="white"
  data-instagram="https://instagram.com/yourusername"
  data-instagram-label="@yourusername"
  data-instagram-border="black"
  data-rss-show="false"
></script>
```

The same settings can also go in an object, set before the script runs:

```html
<script>
  window.briancrinkSocial = {
    desktop: { position: "left" },
    icons: { x: { url: "https://x.com/yourclinic", label: "@yourclinic" } }
  };
</script>
```

Older configs keep working: `"side": "left"` (desktop position), `"links": { "instagram": "…" }`, and `"labels": { "instagram": "…" }`.

## Other options

| Option | Default | What it does |
|---|---|---|
| `zIndex` | `70` | Stacking level of the bar |
| `css` | next to the script | URL of the stylesheet, if you host it elsewhere |

## Script API

```js
briancrinkSocialBar.setPosition({ desktop: "left", mobile: "bottom" });
briancrinkSocialBar.open();     // open a stack into the bar
briancrinkSocialBar.close();    // fold it back up
briancrinkSocialBar.config();   // the config currently in effect
briancrinkSocialBar.destroy();
briancrinkSocialBar.mount();
```

Add `data-manual="true"` to the script tag to stop it from mounting by itself.

## Notes

- If the bar is at the bottom on phones, give the page some bottom padding there so the last line isn't covered. The bar never changes the page layout itself.
- The bar stays hidden until its stylesheet has loaded, so unstyled icons never flash on the screen.
- `demo.html` in this folder shows the bar with a sample config. Open it with a local server (for example `npx serve`) and resize the window to see the mobile layout.
