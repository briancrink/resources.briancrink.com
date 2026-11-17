# Support component

A drop-in "support" section for any webpage:

- **Made with Love 💗 • Enjoying my work?**
- An animated **Buy me a coffee** button (the developer image fades in, the lettering is hand-written, the cup fills, then it loops)
- Personal links underneath: **briancrink.com • @briancrink**
- An optional **small cup button** (for a header or toolbar) that scrolls down to the big button

Everything is built in, including the images and the hand-written lettering, so the component makes **no outside requests** and works offline.

## Files

| File | Purpose | Size |
|---|---|---|
| `support.css` | Styles and animations | ~8 KB |
| `support.js` | Builds the markup and runs the animation | ~77 KB (mostly the built-in developer image) |
| `demo.html` | Self-contained demo with both files embedded, so it works on its own (including in previews) | ~92 KB |

## Quick start

```html
<link rel="stylesheet" href="support.css">

<!-- Big button + links (e.g. in your footer) -->
<div data-bc-support></div>

<!-- Optional: small cup button (e.g. in your header) -->
<button data-bc-support-jump></button>

<script src="support.js" defer></script>
```

The script finds those elements when the page loads and fills them in. Nothing else is needed.

## Settings

Add any of these attributes to the `<div data-bc-support>` to change the defaults:

| Attribute | Default | What it sets |
|---|---|---|
| `data-slug` | `briancrink` | Buy Me a Coffee page (`buymeacoffee.com/<slug>`) |
| `data-site` | `https://briancrink.com` | First link's address |
| `data-site-label` | `briancrink.com` | First link's text |
| `data-social` | `https://briancrink.com/social` | Second link's address |
| `data-handle` | `@briancrink` | Second link's text |
| `data-theme` | `light` | `light`, `dark`, or `auto` (follows the device's light/dark setting) |

Example:

```html
<div data-bc-support data-theme="auto" data-handle="@briancrink"></div>
```

### Small cup button

```html
<button data-bc-support-jump></button>
```

- **Computer:** the cup sits full and fills on hover (or keyboard focus).
- **Phone or tablet:** the cup fills on a loop all the time, since there's no hover.
- **Click or tap:** scrolls smoothly to the big button, which gives one gentle pulse (a small grow plus a soft ripple from its border). Tapping doesn't move focus, so no outline appears. Activating it from the keyboard (Enter or Space) also moves keyboard focus to the big button.
- **Optional attributes:** `data-target="#id"` picks which big button to scroll to (default: the first one on the page), and `data-theme="dark"` or `"auto"` sets its colors.

## JavaScript API

`support.js` adds one global, `BCSupport`:

```js
// Build the big button + links inside an element (same options as the attributes above)
BCSupport.mount(element, {
  slug: 'briancrink',
  site: 'https://briancrink.com',
  siteLabel: 'briancrink.com',
  social: 'https://briancrink.com/social',
  handle: '@briancrink',
  theme: 'light'            // 'light' | 'dark' | 'auto'
});

// Turn any button into the small cup button
BCSupport.mountJump(buttonElement, { target: '#my-support', theme: 'auto' });

// Scroll to a big button and pulse it (element or CSS selector; default: the first one)
// Pass true as the second argument to also move keyboard focus to it
BCSupport.highlight('#my-support');
```

Each element is only set up once, so calling `mount` again on the same element does nothing.

## Theming

**Light** is the default. The **dark** colors apply when:

- the component, or any element above it (for example `<html>`), has `data-theme="dark"`, or
- the component has `data-theme="auto"` and the device is in dark mode.

To adjust colors, override the CSS variables:

```css
.bcs {
  --bcs-label: #555;   /* "Made with Love • Enjoying my work?" */
  --bcs-muted: #6b6b6b;/* link text */
  --bcs-faint: #9a9a9a;/* separator dots */
  --bcs-hover: #222;   /* link text on hover */
  --bcs-focus: #4a78c2;/* keyboard focus outline */
}
.bcs-jump {
  --bcs-jump-bg: #fff;
  --bcs-jump-border: #cfcfcf;
  --bcs-jump-hover: #f3f3f3;
  --bcs-jump-icon: #0D0C22;
}
```

All class names and animation names start with `bcs`, so they won't clash with your page's styles. The component can be used more than once on the same page.

## How the animation works

The big button repeats a **6-second loop**:

| Time | What happens |
|---|---|
| 0 – 0.5 s | The developer image fades in |
| 0.6 – 3.0 s | "Buy me a coffee" is hand-written. Each letter's outline is traced with a pen line, then filled with ink, one letter at a time. Wider letters take longer, so the pace feels natural. |
| 3.0 – 3.3 s | The empty cup appears |
| 3.4 – 4.8 s | The cup fills with coffee |
| 5.4 – 6.0 s | Everything fades out together, then the loop restarts |

**One clock:** `support.js` works out every part's state (the image, each letter and the cup) from the same moment in time, on every frame. Separate CSS animations can drift apart after the page sits in the background or scrolls off screen, which makes parts fade out at slightly different moments. A single clock can't drift. While the button is off screen, the animation pauses to save battery.

**Without JavaScript,** the CSS runs the same loop on its own as a fallback, without the single-clock guarantee.

**The lettering** is the Cookie typeface converted to vector outlines with HarfBuzz (the text-layout engine used by Chrome and Android), so the spacing matches how browsers draw Cookie, including the joined "ff". The letters are built in, so they never depend on downloading a font.

## Accessibility

- Screen readers read the button as "Buy me a coffee". The animated lettering and icons are hidden from them.
- Links and buttons show a clear focus outline for keyboard users.
- On devices set to **reduce motion**, nothing animates: the button simply shows the finished state (image, full text and full cup).

## Security and privacy

- **No outside requests:** the images and lettering are built in. Unlike the official Buy Me a Coffee embed, no third-party script runs on your page.
- Links open in a new tab with `rel="noopener noreferrer"`.
- Only `http` and `https` addresses are accepted for links, and any text you pass in is escaped so it can't run as code.

If your page uses a **Content Security Policy**, it needs to allow:

| Directive | Needs | Why |
|---|---|---|
| `script-src` | `'self'` | to load `support.js` |
| `style-src` | `'self'` | to load `support.css` |
| `img-src` | `data:` | for the built-in developer image |

## Browser support

Current versions of Chrome, Edge, Firefox and Safari, on desktop and on iPhone, iPad and Android.

## Credits and licenses

- **Cookie typeface:** © 2011 Ania Kruk (hello@aniakruk.com), with Reserved Font Name Cookie. Licensed under the [SIL Open Font License, Version 1.1](https://openfontlicense.org). The button lettering is drawn from its outlines. The copyright notice is also kept at the top of `support.css`.
- **Coffee cup icon:** from the Buy Me a Coffee logo, used to link to the Buy Me a Coffee page. Buy Me a Coffee and its logo belong to Buy Me a Coffee.
- **Heart icon and developer image:** provided by Brian Crink.
