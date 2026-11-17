/**
 * Social bar: a reusable, brand-free social media icon bar.
 * Drop-in: <script src="social-bar/config.js" defer></script>
 *          <script src="social-bar/social-bar.js" defer></script>
 * Config (later wins): file defaults < #social-bar-config JSON < window.SocialBarConfig < data-* on this script.
 * All brand details (links, labels, colors) belong in the config, not in this file.
 * Glyphs for Instagram, X, Threads, and Discord use Simple Icons paths (CC0).
 */
(function () {
  "use strict";

  var CURRENT = document.currentScript;
  var SCRIPT_URL = (CURRENT && CURRENT.src) || "";
  var MANUAL = !!(CURRENT && CURRENT.dataset && CURRENT.dataset.manual === "true");

  /* ---------- File defaults (overridden by the page config) ---------- */

  // `color` is the icon fill. `base` is the solid color used to work out a
  // relative border when the fill is a gradient.
  var ITEMS = [
    { id: "instagram", label: "Instagram", color: "linear-gradient(140deg, #f9ce34 0%, #ee2a7b 48%, #6228d7 100%)", base: "#d62976" },
    { id: "x", label: "X", color: "#111111" },
    { id: "threads", label: "Threads", color: "#111111" },
    { id: "facebook", label: "Facebook", color: "#1877f2" },
    { id: "email", label: "Email", color: "#475569" },
    { id: "message", label: "Message", color: "#0e8a9a" },
    { id: "rss", label: "RSS feed", color: "#ee6c1e" },
    { id: "discord", label: "Discord", color: "#5865f2" },
  ];

  // No links ship with the component: an icon appears once the config gives
  // it a url. That keeps every brand detail in the config file.
  var DEFAULT_LINKS = {
    instagram: "",
    x: "",
    threads: "",
    facebook: "",
    email: "",
    message: "",
    rss: "",
    discord: "",
  };

  // The dock is an optional backdrop behind the icons. Off by default.
  var DEFAULT_DOCK = { show: false, color: "#ffffff", opacity: 0.92, blur: true };

  var DEFAULTS = {
    desktop: { position: "right", align: "center", layout: "bar", dock: DEFAULT_DOCK },
    mobile: { position: "bottom", align: "center", layout: "stack", dock: DEFAULT_DOCK },
    stackTimeout: 5,
    // Tooltip ("tag") colors. Neutral by default; set your brand colors in the config.
    tooltip: { color: "#ffffff", background: "#222222" },
    border: "darker",
    borderWidth: 2,
    breakpoint: 760,
    zIndex: 70,
    order: null,
    css: "",
  };

  var ICONS = {
    instagram:
      '<path fill="currentColor" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>',
    x: '<path fill="currentColor" d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/>',
    threads:
      '<path fill="currentColor" d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z"/>',
    facebook:
      '<path fill="currentColor" d="M14.2 4.2h2.6v2.8h-1.7c-.5 0-.8.2-.8.8V10h2.3l-.4 2.6h-1.9v7.2h-2.7v-7.2H9.2V10h2.4V7.6c0-2.1 1.1-3.4 2.6-3.4Z"/>',
    email:
      '<path fill="currentColor" d="M3 6.2h18v11.6H3V6.2Zm1.5 1.4v.4l7.5 4.8 7.5-4.8v-.4H4.5Zm15 2.1-6.7 4.3c-.5.3-1.1.3-1.6 0L4.5 9.7v6.5h15V9.7Z"/>',
    message:
      '<path fill="currentColor" d="M5 4.2h14.2c1 0 1.8.8 1.8 1.8v7.4c0 1-.8 1.8-1.8 1.8H12l-4.2 3.2c-.6.4-1.4 0-1.4-.7v-2.5H5c-1 0-1.8-.8-1.8-1.8V6c0-1 .8-1.8 1.8-1.8Z"/>',
    rss: '<circle cx="6.2" cy="17.7" r="2.35" fill="currentColor"/><path fill="currentColor" d="M3.9 10.1a10 10 0 0 1 10 10h-3.3a6.7 6.7 0 0 0-6.7-6.7v-3.3Z"/><path fill="currentColor" d="M3.9 5.2a14.9 14.9 0 0 1 14.9 14.9h-3.3A11.6 11.6 0 0 0 3.9 8.5V5.2Z"/>',
    discord:
      '<path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>',
  };

  var ITEM_IDS = ITEMS.map(function (item) { return item.id; });
  var POSITIONS = ["left", "right", "top", "bottom"];
  var ALIGNS = ["start", "center", "end"];

  /* ---------- State ---------- */

  var host = null;
  var ownedHost = false;
  var nav = null;
  var cfg = null;
  var rafId = 0;
  var states = [];
  var links = [];
  var inside = false;
  var pointer = { x: 0, y: 0 };
  var mobileQuery = null;
  var mobileListener = null;
  var revealTimer = 0;
  var fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Helpers ---------- */

  function isObj(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  function str(value) {
    return typeof value === "string" ? value.trim() : value == null ? undefined : String(value).trim();
  }

  function cssHref(override) {
    if (override) return override;
    if (SCRIPT_URL) return SCRIPT_URL.replace(/\.js(\?.*)?$/i, ".css$1");
    return "/social-bar/social-bar.css";
  }

  function scriptEl() {
    if (CURRENT) return CURRENT;
    if (SCRIPT_URL) {
      var list = document.querySelectorAll("script[src]");
      for (var i = 0; i < list.length; i++) {
        if (list[i].src === SCRIPT_URL) return list[i];
      }
    }
    return document.querySelector("script[src*='social-bar.js']");
  }

  function safeHref(value) {
    var url = String(value == null ? "" : value).trim();
    if (!url) return "";
    if (/^(https?:|mailto:|sms:|tel:)/i.test(url)) return url;
    if (url.charAt(0) === "/" || url.indexOf("./") === 0 || url.indexOf("../") === 0) return url;
    if (/^[\w.-]+\.(xml|rss)$/i.test(url)) return url;
    if (/^[a-z0-9.-]+\.[a-z]{2,}([/?#].*)?$/i.test(url)) return "https://" + url;
    return "";
  }

  function parseShow(value) {
    if (value === undefined || value === null || value === "") return undefined;
    if (value === true || value === false) return value ? "both" : "none";
    var v = String(value).trim().toLowerCase();
    if (v === "true" || v === "yes" || v === "both" || v === "all") return "both";
    if (v === "false" || v === "no" || v === "none" || v === "hide" || v === "hidden") return "none";
    if (v === "desktop" || v === "mobile") return v;
    return undefined;
  }

  function parseLayout(value) {
    var v = str(value);
    if (!v) return undefined;
    v = v.toLowerCase();
    if (v === "deck" || v === "cards" || v === "stacked") v = "stack";
    if (v === "dock" || v === "row" || v === "column") v = "bar";
    return v === "stack" || v === "bar" ? v : undefined;
  }

  // Accepts an edge ("left"), "center", or a corner in any spelling:
  // "top-left", "top left", "left_top", ["top", "left"] ...
  // A corner becomes a vertical column on that side, pinned to that end, so a
  // stack there opens up or down along the side instead of across the screen.
  function parsePosition(value) {
    if (Array.isArray(value)) value = value.join(" ");
    var v = str(value);
    if (!v) return {};
    v = v.toLowerCase();
    if (v === "center") return { position: "bottom", align: "center", corner: "" };
    if (POSITIONS.indexOf(v) !== -1) return { position: v, corner: "" };
    var parts = v.replace(/([a-z])(?=(top|bottom|left|right))/g, "$1 ").split(/[\s,_\-\/]+/);
    var vert = parts.indexOf("top") !== -1 ? "top" : parts.indexOf("bottom") !== -1 ? "bottom" : "";
    var horiz = parts.indexOf("left") !== -1 ? "left" : parts.indexOf("right") !== -1 ? "right" : "";
    if (vert && horiz) return { position: horiz, align: vert === "top" ? "start" : "end", corner: vert + "-" + horiz };
    return {};
  }

  function parseAlign(value) {
    var v = str(value);
    if (!v) return undefined;
    v = v.toLowerCase();
    if (v === "middle") v = "center";
    if (v === "top" || v === "left") v = "start";
    if (v === "bottom" || v === "right") v = "end";
    return ALIGNS.indexOf(v) !== -1 ? v : undefined;
  }

  function parseBool(value) {
    if (value === true || value === false) return value;
    var v = String(value == null ? "" : value).trim().toLowerCase();
    if (v === "true" || v === "yes" || v === "on" || v === "1") return true;
    if (v === "false" || v === "no" || v === "off" || v === "0") return false;
    return undefined;
  }

  // Accepts 0–1, 0–100, or "80%". Returns 0–1.
  function parseOpacity(value) {
    if (value === undefined || value === null || value === "") return undefined;
    var s = String(value).trim();
    var n = parseFloat(s);
    if (isNaN(n)) return undefined;
    if (/%$/.test(s) || n > 1) n = n / 100;
    return Math.max(0, Math.min(1, n));
  }

  // dock: true | false | { show, color, opacity, blur }
  function parseDock(value) {
    if (value === undefined || value === null) return undefined;
    var b = parseBool(value);
    if (b !== undefined) return { show: b };
    if (!isObj(value)) return undefined;
    var out = {};
    var show = parseBool(value.show);
    if (show !== undefined) out.show = show;
    else if (value.color !== undefined || value.opacity !== undefined) out.show = true;
    if (str(value.color) && supportsColor(str(value.color))) out.color = str(value.color);
    var op = parseOpacity(value.opacity);
    if (op !== undefined) out.opacity = op;
    var blur = parseBool(value.blur);
    if (blur !== undefined) out.blur = blur;
    return Object.keys(out).length ? out : undefined;
  }

  // tooltip: { color, background }  ("text" and "bg" also accepted)
  function parseTooltip(value) {
    if (!isObj(value)) return undefined;
    var out = {};
    var color = str(value.color !== undefined ? value.color : value.text);
    var bg = str(value.background !== undefined ? value.background : value.bg);
    if (color && supportsColor(color)) out.color = color;
    if (bg && supportsBackground(bg)) out.background = bg;
    return Object.keys(out).length ? out : undefined;
  }

  function dockBackground(dock) {
    var opacity = dock.opacity === undefined ? 0.92 : dock.opacity;
    var rgb = parseColor(dock.color);
    if (rgb) return "rgba(" + rgb.join(", ") + ", " + opacity + ")";
    return "color-mix(in srgb, " + dock.color + " " + Math.round(opacity * 100) + "%, transparent)";
  }

  /* ---------- Color ---------- */

  function parseColor(value) {
    var v = String(value || "").trim().toLowerCase();
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(v);
    if (m) {
      var h = m[1];
      if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    m = /^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/.exec(v);
    if (m) return [+m[1], +m[2], +m[3]];
    return null;
  }

  function toHex(rgb) {
    return "#" + rgb.map(function (n) {
      var c = Math.max(0, Math.min(255, Math.round(n))).toString(16);
      return c.length === 1 ? "0" + c : c;
    }).join("");
  }

  function mix(rgb, target, amount) {
    return [0, 1, 2].map(function (i) { return rgb[i] + (target[i] - rgb[i]) * amount; });
  }

  function supportsColor(value) {
    try {
      return !!(window.CSS && CSS.supports && CSS.supports("color", value));
    } catch (err) {
      return false;
    }
  }

  function supportsBackground(value) {
    try {
      return !!(window.CSS && CSS.supports && CSS.supports("background", value));
    } catch (err) {
      return false;
    }
  }

  // Returns a CSS color for the ring, or null for no ring.
  function ringColor(mode, base) {
    var m = String(mode || "darker").trim();
    var key = m.toLowerCase();
    var rgb = parseColor(base);
    if (key === "none" || key === "transparent" || key === "off" || key === "false") return null;
    if (key === "darker" || key === "dark") {
      if (rgb) return toHex(mix(rgb, [0, 0, 0], 0.3));
      return "color-mix(in srgb, " + base + " 70%, #000)";
    }
    if (key === "lighter" || key === "light") {
      if (rgb) return toHex(mix(rgb, [255, 255, 255], 0.4));
      return "color-mix(in srgb, " + base + " 60%, #fff)";
    }
    if (key === "black") return "#000000";
    if (key === "white") return "#ffffff";
    if (supportsColor(m)) return m;
    return ringColor("darker", base);
  }

  /* ---------- Config ---------- */

  // Normalizes any config source (JSON block, window object) into one shape.
  function normalize(src) {
    var out = { desktop: {}, mobile: {}, icons: {} };
    if (!isObj(src)) return out;

    // Global placement. `side` is the old option and only ever applied to desktop.
    var legacy = parsePosition(src.side);
    if (legacy.position) out.desktop.position = legacy.position;

    if (typeof src.position === "string" || Array.isArray(src.position)) {
      var both = parsePosition(src.position);
      ["desktop", "mobile"].forEach(function (mode) { Object.assign(out[mode], both); });
    } else if (isObj(src.position)) {
      ["desktop", "mobile"].forEach(function (mode) { Object.assign(out[mode], parsePosition(src.position[mode])); });
    }
    if (typeof src.align === "string") {
      var a = parseAlign(src.align);
      if (a) { out.desktop.align = a; out.mobile.align = a; }
    } else if (isObj(src.align)) {
      ["desktop", "mobile"].forEach(function (mode) {
        var al = parseAlign(src.align[mode]);
        if (al) out[mode].align = al;
      });
    }
    if (typeof src.layout === "string") {
      var lay = parseLayout(src.layout);
      if (lay) { out.desktop.layout = lay; out.mobile.layout = lay; }
    } else if (isObj(src.layout)) {
      ["desktop", "mobile"].forEach(function (mode) {
        var l = parseLayout(src.layout[mode]);
        if (l) out[mode].layout = l;
      });
    }
    if (src.stackTimeout !== undefined && !isNaN(parseFloat(src.stackTimeout))) {
      out.stackTimeout = Math.max(1, parseFloat(src.stackTimeout));
    }

    var dockAll = parseDock(src.dock);
    if (dockAll) { out.desktop.dock = Object.assign({}, dockAll); out.mobile.dock = Object.assign({}, dockAll); }

    ["desktop", "mobile"].forEach(function (mode) {
      var block = src[mode];
      if (typeof block === "string") Object.assign(out[mode], parsePosition(block));
      else if (isObj(block)) {
        Object.assign(out[mode], parsePosition(block.position));
        var al = parseAlign(block.align);
        if (al) out[mode].align = al;
        var ly = parseLayout(block.layout);
        if (ly) out[mode].layout = ly;
        var dk = parseDock(block.dock);
        if (dk) out[mode].dock = Object.assign({}, out[mode].dock || {}, dk);
      }
    });

    // "position": "top" + "align": "left" (an edge plus a crossing edge) also
    // means a corner.
    ["desktop", "mobile"].forEach(function (mode) {
      var block = isObj(src[mode]) ? src[mode] : {};
      var rawAlign = block.align !== undefined ? block.align
        : isObj(src.align) ? src.align[mode] : src.align;
      var a = str(rawAlign);
      var p = out[mode].position;
      if (!a || !p || out[mode].corner) return;
      a = a.toLowerCase();
      var vertical = p === "left" || p === "right";
      if (!vertical && (a === "left" || a === "right")) {
        Object.assign(out[mode], parsePosition(p + "-" + a));
      } else if (vertical && (a === "top" || a === "bottom")) {
        Object.assign(out[mode], parsePosition(a + "-" + p));
      }
    });

    // A corner decides its own alignment, even if "align" is also set.
    ["desktop", "mobile"].forEach(function (mode) {
      var c = out[mode].corner;
      if (c) out[mode].align = c.indexOf("top") === 0 ? "start" : "end";
    });

    var tip = parseTooltip(src.tooltip);
    if (tip) out.tooltip = tip;

    if (str(src.border)) out.border = str(src.border);
    if (src.borderWidth !== undefined && !isNaN(parseFloat(src.borderWidth))) out.borderWidth = parseFloat(src.borderWidth);
    if (src.breakpoint !== undefined && !isNaN(parseFloat(src.breakpoint))) out.breakpoint = parseFloat(src.breakpoint);
    if (src.zIndex !== undefined && !isNaN(parseInt(src.zIndex, 10))) out.zIndex = parseInt(src.zIndex, 10);
    if (Array.isArray(src.order)) out.order = src.order.map(String);
    else if (typeof src.order === "string" && src.order.trim()) out.order = src.order.split(/[\s,]+/);
    if (str(src.css)) out.css = str(src.css);

    function icon(id) {
      if (!out.icons[id]) out.icons[id] = {};
      return out.icons[id];
    }

    // Old shapes: { links: { id: url } }, { labels: { id: text } }, or bare { id: url }.
    if (isObj(src.links)) {
      Object.keys(src.links).forEach(function (id) {
        if (ITEM_IDS.indexOf(id) !== -1 && typeof src.links[id] === "string") icon(id).url = src.links[id];
      });
    }
    if (isObj(src.labels)) {
      Object.keys(src.labels).forEach(function (id) {
        if (ITEM_IDS.indexOf(id) !== -1 && typeof src.labels[id] === "string") icon(id).label = src.labels[id];
      });
    }
    ITEM_IDS.forEach(function (id) {
      if (typeof src[id] === "string") icon(id).url = src[id];
    });

    // Current shape: { icons: { id: "url" | { url, label, border, color, show } } }.
    if (isObj(src.icons)) {
      Object.keys(src.icons).forEach(function (id) {
        if (ITEM_IDS.indexOf(id) === -1) {
          if (window.console) console.warn("[Social Bar] Unknown icon \"" + id + "\". Use one of: " + ITEM_IDS.join(", "));
          return;
        }
        var v = src.icons[id];
        var t = icon(id);
        if (typeof v === "string") { t.url = v; return; }
        if (v === false || v === null) { t.show = "none"; return; }
        if (!isObj(v)) return;
        var url = v.url !== undefined ? v.url : v.href;
        if (typeof url === "string") t.url = url;
        var label = v.label !== undefined ? v.label : v.text !== undefined ? v.text : v.tag;
        if (typeof label === "string") t.label = label;
        if (str(v.border)) t.border = str(v.border);
        if (str(v.color)) t.color = str(v.color);
        var itip = parseTooltip(v.tooltip);
        if (itip) t.tooltip = itip;
        var show = parseShow(v.show);
        if (show) t.show = show;
      });
    }
    return out;
  }

  // Reads data-* attributes on the script tag into the same shape as normalize().
  function fromDataset(el) {
    var d = (el && el.dataset) || {};
    var src = { icons: {} };
    if (d.side) src.side = d.side;
    if (d.position) src.position = d.position;
    if (d.align) src.align = d.align;
    src.desktop = { position: d.positionDesktop, align: d.alignDesktop, layout: d.layoutDesktop };
    src.mobile = { position: d.positionMobile, align: d.alignMobile, layout: d.layoutMobile };
    if (d.layout) src.layout = d.layout;
    if (d.stackTimeout) src.stackTimeout = d.stackTimeout;
    var dock = {};
    if (d.dock) dock.show = d.dock;
    if (d.dockColor) dock.color = d.dockColor;
    if (d.dockOpacity) dock.opacity = d.dockOpacity;
    if (d.dockBlur) dock.blur = d.dockBlur;
    if (Object.keys(dock).length) src.dock = dock;
    if (d.dockDesktop) src.desktop.dock = d.dockDesktop;
    if (d.dockMobile) src.mobile.dock = d.dockMobile;
    if (d.border) src.border = d.border;
    if (d.tooltipColor || d.tooltipBackground) src.tooltip = { color: d.tooltipColor, background: d.tooltipBackground };
    if (d.borderWidth) src.borderWidth = d.borderWidth;
    if (d.breakpoint) src.breakpoint = d.breakpoint;
    if (d.zIndex) src.zIndex = d.zIndex;
    if (d.order) src.order = d.order;
    if (d.css) src.css = d.css;
    ITEM_IDS.forEach(function (id) {
      var entry = {};
      if (typeof d[id] === "string") entry.url = d[id];
      if (typeof d[id + "Label"] === "string") entry.label = d[id + "Label"];
      if (d[id + "Border"]) entry.border = d[id + "Border"];
      if (d[id + "Color"]) entry.color = d[id + "Color"];
      if (d[id + "Show"]) entry.show = d[id + "Show"];
      if (Object.keys(entry).length) src.icons[id] = entry;
    });
    return normalize(src);
  }

  function merge(target, src) {
    ["desktop", "mobile"].forEach(function (mode) {
      var dock = src[mode].dock;
      Object.assign(target[mode], src[mode]);
      if (dock) target[mode].dock = Object.assign({}, target[mode].dock || {}, dock);
    });
    ["border", "borderWidth", "breakpoint", "zIndex", "order", "css", "stackTimeout"].forEach(function (key) {
      if (src[key] !== undefined) target[key] = src[key];
    });
    if (src.tooltip) target.tooltip = Object.assign({}, target.tooltip || {}, src.tooltip);
    Object.keys(src.icons).forEach(function (id) {
      target.icons[id] = Object.assign({}, target.icons[id] || {}, src.icons[id]);
    });
    return target;
  }

  function readConfig() {
    var fromJson = {};
    var node = document.getElementById("social-bar-config");
    if (node && node.textContent) {
      try {
        fromJson = JSON.parse(node.textContent);
      } catch (err) {
        if (window.console) console.error("[Social Bar] #social-bar-config is not valid JSON:", err.message);
      }
    }

    var result = {
      desktop: Object.assign({}, DEFAULTS.desktop),
      mobile: Object.assign({}, DEFAULTS.mobile),
      border: DEFAULTS.border,
      borderWidth: DEFAULTS.borderWidth,
      breakpoint: DEFAULTS.breakpoint,
      zIndex: DEFAULTS.zIndex,
      order: DEFAULTS.order,
      css: DEFAULTS.css,
      stackTimeout: DEFAULTS.stackTimeout,
      tooltip: Object.assign({}, DEFAULTS.tooltip),
      icons: {},
    };
    ITEMS.forEach(function (item) {
      result.icons[item.id] = { url: DEFAULT_LINKS[item.id] || "", label: item.label, color: item.color, show: "both" };
    });

    merge(result, normalize(fromJson));
    merge(result, normalize(window.SocialBarConfig));
    merge(result, fromDataset(scriptEl()));
    return result;
  }

  function orderedItems(order) {
    if (!order || !order.length) return ITEMS.slice();
    var seen = {};
    var list = [];
    order.forEach(function (id) {
      var item = ITEMS.filter(function (it) { return it.id === id; })[0];
      if (item && !seen[id]) { list.push(item); seen[id] = true; }
    });
    ITEMS.forEach(function (item) { if (!seen[item.id]) list.push(item); });
    return list;
  }

  /* ---------- Layout ---------- */

  function currentMode() {
    return mobileQuery && mobileQuery.matches ? "mobile" : "desktop";
  }

  function isVertical() {
    var pos = nav && nav.getAttribute("data-pos");
    return pos === "left" || pos === "right";
  }

  // The magnify effect runs at any window width. Mouse input drives it on
  // hover; touch input drives it while a finger slides along the bar.
  function motionOn() {
    return !!nav && !reduceQuery.matches;
  }

  function applyLayout() {
    if (!nav || !cfg) return;
    var mode = currentMode();
    var place = cfg[mode];
    var prev = nav.getAttribute("data-mode") + nav.getAttribute("data-pos");
    nav.setAttribute("data-mode", mode);
    nav.setAttribute("data-pos", place.position);
    nav.setAttribute("data-align", place.align || "center");
    if (place.corner) nav.setAttribute("data-corner", place.corner);
    else nav.removeAttribute("data-corner");
    nav.setAttribute("aria-orientation", isVertical() ? "vertical" : "horizontal");
    var dock = place.dock || DEFAULT_DOCK;
    nav.setAttribute("data-dock", dock.show ? "on" : "off");
    if (dock.show) {
      nav.style.setProperty("--sb-dock-bg", dockBackground(Object.assign({}, DEFAULT_DOCK, dock)));
      nav.style.setProperty("--sb-dock-blur", dock.blur === false ? "none" : "blur(16px) saturate(1.2)");
    } else {
      nav.style.removeProperty("--sb-dock-bg");
      nav.style.removeProperty("--sb-dock-blur");
    }
    var layout = place.layout || "bar";
    var changed = prev !== mode + place.position || nav.getAttribute("data-layout") !== layout;
    nav.setAttribute("data-layout", layout);
    if (changed) {
      clearMotion();
      stackOpen = false;
      clearStackTimers();
    }
    updateStack(true);
  }

  /* ---------- Stack layout ---------- */

  // In "stack" layout the icons keep their bar positions in the layout, but are
  // translated onto one anchor point like a deck of cards. Opening the stack
  // removes the translation so they glide back out into the bar.

  var stackOpen = false;
  var stackTimer = 0;
  var leaveTimer = 0;
  var lastPointerDown = 0;
  var lastWidth = 0;
  var lastHeight = 0;

  function isStack() {
    return !!nav && nav.getAttribute("data-layout") === "stack";
  }

  function clearStackTimers() {
    if (stackTimer) clearTimeout(stackTimer);
    if (leaveTimer) clearTimeout(leaveTimer);
    stackTimer = 0;
    leaveTimer = 0;
  }

  function visibleLinks() {
    return links.filter(function (link) {
      return link.offsetWidth > 0;
    });
  }

  function updateStack(instant) {
    if (!nav) return;
    var stack = isStack();
    var ready = nav.classList.contains("is-ready");
    if (instant) nav.classList.add("is-instant");

    links.forEach(function (link) {
      link.style.transform = "";
      link.style.zIndex = "";
      link.removeAttribute("data-stack-role");
      link.style.removeProperty("--sb-i");
    });

    var list = visibleLinks();
    var count = list.length;
    list.forEach(function (link, i) {
      // Stagger: open from the top card outward, close from the far end inward.
      link.style.setProperty("--sb-i", String(stackOpen ? i : count - 1 - i));
    });

    if (stack && !stackOpen && count && ready) {
      var pos = nav.getAttribute("data-pos");
      var align = nav.getAttribute("data-align");
      var ax;
      var ay;
      if (align === "start" || align === "end") {
        var pin = align === "start" ? list[0] : list[count - 1];
        ax = pin.offsetLeft + pin.offsetWidth / 2;
        ay = pin.offsetTop + pin.offsetHeight / 2;
      } else {
        var first = list[0];
        var last = list[count - 1];
        ax = (first.offsetLeft + last.offsetLeft + last.offsetWidth) / 2;
        ay = (first.offsetTop + last.offsetTop + last.offsetHeight) / 2;
      }
      // The other icons sit in a loose ring behind the top one, each peeking out
      // a little, like a casually squared-up deck. Angle, distance and tilt get
      // a small fixed "randomness" so it looks hand-stacked, not geometric, and
      // looks the same on every page load.
      var backCount = count - 1;
      var size = list[0].offsetWidth || 36;
      var slice = backCount ? 360 / backCount : 0;
      list.forEach(function (link, i) {
        var dx = ax - (link.offsetLeft + link.offsetWidth / 2);
        var dy = ay - (link.offsetTop + link.offsetHeight / 2);
        var t;
        if (i === 0) {
          t = "translate(" + dx.toFixed(2) + "px," + dy.toFixed(2) + "px)";
        } else {
          var angle = (-105 + (i - 1) * slice + (jitter(i) - 0.5) * slice * 0.5) * Math.PI / 180;
          var radius = size * (0.15 + jitter(i + 31) * 0.08);
          var tilt = (jitter(i + 57) - 0.5) * 18;
          var ox = Math.cos(angle) * radius;
          var oy = Math.sin(angle) * radius;
          t = "translate(" + (dx + ox).toFixed(2) + "px," + (dy + oy).toFixed(2) + "px) rotate(" + tilt.toFixed(2) + "deg)";
        }
        link.style.transform = t;
        link.style.zIndex = String(count - i);
        link.setAttribute("data-stack-role", i === 0 ? "top" : "back");
      });
    }

    nav.setAttribute("data-stack", stack ? (stackOpen ? "open" : "closed") : "none");

    if (instant) {
      void nav.offsetWidth; // apply the new transforms before re-enabling transitions
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (nav) nav.classList.remove("is-instant");
        });
      });
    }
  }

  // Repeatable pseudo-random number in [0, 1) for a given seed.
  function jitter(seed) {
    var x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function setStackOpen(open, viaTouch) {
    if (!isStack()) return;
    if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = 0; }
    if (stackOpen !== open) {
      stackOpen = open;
      if (!open) clearMotion();
      updateStack(false);
    }
    if (stackTimer) { clearTimeout(stackTimer); stackTimer = 0; }
    if (open && viaTouch) {
      stackTimer = setTimeout(function () { setStackOpen(false); }, (cfg.stackTimeout || 5) * 1000);
    }
  }

  function bindStack() {
    if (!nav) return;

    nav.addEventListener("pointerdown", function (event) {
      lastPointerDown = Date.now();
      // Any touch on an open stack counts as activity and restarts the timer.
      if (isStack() && stackOpen && !isMouse(event)) setStackOpen(true, true);
    });

    // Mouse: hovering the stack opens it into a bar; leaving closes it again.
    nav.addEventListener("pointerenter", function (event) {
      if (isStack() && isMouse(event) && event.pointerType) setStackOpen(true, false);
    });
    nav.addEventListener("pointerleave", function (event) {
      if (!isStack() || !isMouse(event) || !event.pointerType) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(function () { setStackOpen(false); }, 220);
    });

    // Touch: the first tap on the top card opens the stack instead of following the link.
    nav.addEventListener("click", function (event) {
      if (!isStack() || stackOpen) return;
      event.preventDefault();
      event.stopPropagation();
      setStackOpen(true, true);
    }, true);

    nav.addEventListener("scroll", function () {
      if (isStack() && stackOpen && stackTimer) setStackOpen(true, true);
    }, { passive: true });

    // Keyboard: tabbing into the stack opens it; tabbing out closes it.
    nav.addEventListener("focusin", function () {
      if (!isStack() || Date.now() - lastPointerDown < 700) return;
      setStackOpen(true, false);
    });
    nav.addEventListener("focusout", function (event) {
      if (!isStack() || (event.relatedTarget && nav.contains(event.relatedTarget))) return;
      if (Date.now() - lastPointerDown < 700) return;
      setStackOpen(false);
    });
  }

  // A tap anywhere else on the page closes an open stack.
  document.addEventListener("pointerdown", function (event) {
    if (!nav || !isStack() || !stackOpen || isMouse(event)) return;
    var path = event.composedPath ? event.composedPath() : [];
    if (path.indexOf(nav) === -1) setStackOpen(false);
  }, { passive: true });

  window.addEventListener("resize", function () {
    if (!nav || !isStack()) return;
    // Phone toolbars change the height while scrolling; only re-measure when
    // the change can actually move the icons.
    var w = window.innerWidth;
    var h = window.innerHeight;
    var vertical = isVertical();
    if (w === lastWidth && (!vertical || h === lastHeight)) return;
    lastWidth = w;
    lastHeight = h;
    requestAnimationFrame(function () { updateStack(true); });
  }, { passive: true });

  /* ---------- Motion ---------- */

  function stopLoop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function resetState(state) {
    state.s = 1; state.vs = 0; state.jx = 1; state.jy = 1; state.vjx = 0; state.vjy = 0;
  }

  function clearMotion() {
    stopLoop();
    inside = false;
    if (!nav) return;
    nav.classList.remove("is-live");
    links.forEach(function (link, i) {
      var jelly = link.querySelector(".social-bar__jelly");
      if (jelly) jelly.style.transform = "";
      if (states[i]) resetState(states[i]);
    });
  }

  function spring(value, vel, target, k, damp, dt) {
    var acc = (target - value) * k - vel * damp;
    vel += acc * dt;
    value += vel * dt;
    return [value, vel];
  }

  function frame(now) {
    rafId = 0;
    if (!motionOn()) {
      clearMotion();
      return;
    }
    var dt = Math.min(0.032, frame.last ? (now - frame.last) / 1000 : 0.016);
    frame.last = now;
    var pos = nav.getAttribute("data-pos");
    var vertical = pos === "left" || pos === "right";
    var calm = !inside;

    links.forEach(function (link, index) {
      var state = states[index];
      // Geometry comes from the link box, which never moves. Only the inner
      // .social-bar__jelly is transformed, and it ignores the pointer.
      var rect = link.getBoundingClientRect();
      if (!rect.width) return;
      var target = 1;
      if (inside) {
        var center = vertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
        var dist = Math.abs((vertical ? pointer.y : pointer.x) - center);
        var reach = (vertical ? rect.height : rect.width) * 2.35;
        var influence = Math.max(0, 1 - dist / reach);
        target = 1 + Math.pow(influence, 1.35) * 0.28;
      }
      var scaled = spring(state.s, state.vs, target, 280, 18, dt);
      state.s = scaled[0];
      state.vs = scaled[1];
      var jx = spring(state.jx, state.vjx, 1, 360, 13, dt);
      state.jx = jx[0];
      state.vjx = jx[1];
      var jy = spring(state.jy, state.vjy, 1, 360, 13, dt);
      state.jy = jy[0];
      state.vjy = jy[1];

      var sx = state.s * state.jx;
      var sy = state.s * state.jy;
      var lift = (state.s - 1) * 22;
      var tx = pos === "right" ? -lift : pos === "left" ? lift : 0;
      var ty = pos === "bottom" ? -lift : pos === "top" ? lift : 0;
      var jelly = link.querySelector(".social-bar__jelly");
      if (jelly) {
        jelly.style.transform =
          "translate(" + tx.toFixed(3) + "px," + ty.toFixed(3) + "px) scale(" + sx.toFixed(4) + "," + sy.toFixed(4) + ")";
      }
      if (Math.abs(state.s - 1) > 0.004 || Math.abs(state.jx - 1) > 0.004 || Math.abs(state.jy - 1) > 0.004) calm = false;
      if (Math.abs(state.vs) > 0.02 || Math.abs(state.vjx) > 0.02 || Math.abs(state.vjy) > 0.02) calm = false;
    });

    if (calm) {
      clearMotion();
      return;
    }
    rafId = requestAnimationFrame(frame);
  }

  function wake() {
    if (!rafId) {
      frame.last = 0;
      rafId = requestAnimationFrame(frame);
    }
  }

  function isMouse(event) {
    return !event.pointerType || event.pointerType === "mouse" || event.pointerType === "pen";
  }

  var scrubbing = false;
  var scrubLink = null;
  var suppressClickUntil = 0;
  var syntheticClick = false;

  function linkAt(x, y) {
    if (!nav) return null;
    var root = nav.getRootNode();
    var el = root && root.elementFromPoint ? root.elementFromPoint(x, y) : null;
    return el && el.closest ? el.closest(".social-bar__link") : null;
  }

  // Squash-and-settle "jelly" on the icon the pointer or finger just reached.
  function squash(link) {
    var index = links.indexOf(link);
    if (index === -1 || !motionOn()) return;
    var st = states[index];
    // Squash only once per real entry: skip if this icon is still wobbling.
    if (Math.abs(st.jx - 1) > 0.05) return;
    var wide = isVertical();
    st.jx = wide ? 1.16 : 0.86;
    st.jy = wide ? 0.84 : 1.14;
    st.vjx = 0;
    st.vjy = 0;
    nav.classList.add("is-live");
    wake();
  }

  function bindMotion() {
    if (!nav) return;

    function track(event) {
      if (!motionOn() || !isMouse(event)) return;
      inside = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      nav.classList.add("is-live");
      wake();
    }

    nav.addEventListener("pointerenter", track);
    nav.addEventListener("pointermove", track);
    nav.addEventListener("pointerleave", function (event) {
      if (!isMouse(event)) return;
      inside = false;
      if (rafId || nav.classList.contains("is-live")) wake();
    });

    links.forEach(function (link) {
      link.addEventListener("pointerenter", function (event) {
        if (isMouse(event)) squash(link);
      });
    });

    /* ----- Touch: slide a finger along the bar, release to open an icon ----- */

    function scrubTo(event) {
      inside = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      var link = linkAt(event.clientX, event.clientY);
      if (link && link !== scrubLink) squash(link);
      scrubLink = link;
      nav.classList.add("is-live");
      wake();
      if (isStack() && stackOpen && stackTimer) setStackOpen(true, true); // still active
    }

    function endScrub(event, activate) {
      if (!scrubbing) return;
      scrubbing = false;
      inside = false;
      wake();
      var link = activate ? linkAt(event.clientX, event.clientY) : null;
      scrubLink = null;
      // The browser's own click would land on whatever icon the finger first
      // touched; the icon under the finger at release wins instead.
      suppressClickUntil = Date.now() + 700;
      if (link) {
        syntheticClick = true;
        try { link.click(); } finally { syntheticClick = false; }
      }
    }

    nav.addEventListener("pointerdown", function (event) {
      if (isMouse(event) || !motionOn()) return;
      // A closed stack opens on tap first (handled by the stack code).
      if (nav.getAttribute("data-stack") === "closed") return;
      scrubbing = true;
      scrubLink = null;
      scrubTo(event);
    });
    nav.addEventListener("pointermove", function (event) {
      if (scrubbing && !isMouse(event)) scrubTo(event);
    });
    nav.addEventListener("pointerup", function (event) {
      if (!isMouse(event)) endScrub(event, true);
    });
    nav.addEventListener("pointercancel", function (event) {
      if (!isMouse(event)) endScrub(event, false);
    });

    nav.addEventListener("click", function (event) {
      if (syntheticClick || Date.now() > suppressClickUntil) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);
  }

  /* ---------- Mount ---------- */

  function bindMediaQuery(breakpoint) {
    if (mobileQuery && mobileListener) {
      if (mobileQuery.removeEventListener) mobileQuery.removeEventListener("change", mobileListener);
      else if (mobileQuery.removeListener) mobileQuery.removeListener(mobileListener);
    }
    mobileQuery = window.matchMedia(
      "(max-width: " + breakpoint + "px), (max-height: 500px) and (pointer: coarse)"
    );
    mobileListener = function () { applyLayout(); };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", mobileListener);
    else if (mobileQuery.addListener) mobileQuery.addListener(mobileListener);
  }

  function destroy() {
    clearMotion();
    clearStackTimers();
    stackOpen = false;
    if (revealTimer) clearTimeout(revealTimer);
    revealTimer = 0;
    if (host && host.shadowRoot) host.shadowRoot.innerHTML = "";
    if (ownedHost && host) host.remove();
    host = null;
    ownedHost = false;
    nav = null;
    links = [];
    states = [];
    document.documentElement.classList.remove("social-bar-on");
  }

  function buildLink(item, icon) {
    var href = safeHref(icon.url);
    if (!href || icon.show === "none") return null;

    var label = typeof icon.label === "string" && icon.label.trim() ? icon.label : item.label;
    var anchor = document.createElement("a");
    anchor.className = "social-bar__link";
    anchor.href = href;
    anchor.setAttribute("aria-label", label);
    anchor.setAttribute("data-show", icon.show || "both");
    if (/^https?:/i.test(href)) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }

    var jelly = document.createElement("span");
    jelly.className = "social-bar__jelly";
    jelly.setAttribute("data-net", item.id);

    var fill = icon.color && supportsBackground(icon.color) ? icon.color : item.color;
    jelly.style.setProperty("--sb-bg", fill);

    // Base for "darker"/"lighter": the custom fill if it is a plain color,
    // otherwise the network's solid brand color.
    var base = item.base || item.color;
    if (icon.color && icon.color !== item.color && supportsColor(icon.color)) base = icon.color;
    var ring = ringColor(icon.border || cfg.border, base);
    if (ring) jelly.style.setProperty("--sb-ring", ring);
    else jelly.style.setProperty("--sb-ring-w", "0px");

    // width/height attributes keep the glyph small even before the stylesheet applies.
    jelly.innerHTML =
      '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">' + ICONS[item.id] + "</svg>";

    var tip = document.createElement("span");
    tip.className = "social-bar__tip";
    tip.setAttribute("aria-hidden", "true");
    tip.textContent = label;
    if (icon.tooltip && icon.tooltip.color) tip.style.setProperty("--sb-tip-color", icon.tooltip.color);
    if (icon.tooltip && icon.tooltip.background) tip.style.setProperty("--sb-tip-bg", icon.tooltip.background);

    anchor.appendChild(jelly);
    anchor.appendChild(tip);
    return anchor;
  }

  function mount(target) {
    destroy();
    cfg = readConfig();
    bindMediaQuery(cfg.breakpoint);

    var mountHost = target || null;
    ownedHost = !mountHost;
    if (!mountHost) {
      mountHost = document.createElement("div");
      mountHost.id = "social-bar-host";
      mountHost.style.cssText = "position:fixed;inset:0;z-index:" + cfg.zIndex + ";pointer-events:none;";
      (document.body || document.documentElement).appendChild(mountHost);
    }
    host = mountHost;
    var shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
    shadow.innerHTML = "";

    // Keep the bar invisible until its stylesheet has loaded. Without this the
    // raw SVGs paint at full size in link-blue for a frame or two.
    var guard = document.createElement("style");
    guard.textContent = ".social-bar:not(.is-ready){visibility:hidden!important;}";
    shadow.appendChild(guard);

    var styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = cssHref(cfg.css);

    nav = document.createElement("nav");
    nav.className = "social-bar";
    nav.setAttribute("aria-label", "Social media");
    nav.style.setProperty("--sb-ring-w", cfg.borderWidth + "px");
    nav.style.setProperty("--sb-tip-color", cfg.tooltip.color);
    nav.style.setProperty("--sb-tip-bg", cfg.tooltip.background);

    var currentNav = nav;
    var reveal = function () {
      if (revealTimer) clearTimeout(revealTimer);
      revealTimer = 0;
      if (currentNav !== nav || nav.classList.contains("is-ready")) return;
      nav.classList.add("is-ready");
      lastWidth = window.innerWidth;
      lastHeight = window.innerHeight;
      // Positions are only measurable once the stylesheet applies.
      updateStack(true);
    };
    styleLink.addEventListener("load", reveal);
    styleLink.addEventListener("error", function () {
      if (window.console) console.error("[Social Bar] Could not load " + styleLink.href + ". Set \"css\" in the config to its URL.");
    });
    // Fallback in case a browser skips the load event for a cached sheet.
    revealTimer = setTimeout(function () {
      try {
        if (styleLink.sheet && styleLink.sheet.cssRules) reveal();
      } catch (err) {
        reveal();
      }
    }, 2500);

    shadow.appendChild(styleLink);

    orderedItems(cfg.order).forEach(function (item) {
      var link = buildLink(item, cfg.icons[item.id] || {});
      if (link) nav.appendChild(link);
    });

    shadow.appendChild(nav);
    applyLayout();
    links = Array.prototype.slice.call(nav.querySelectorAll(".social-bar__link"));
    states = links.map(function () {
      return { s: 1, vs: 0, jx: 1, jy: 1, vjx: 0, vjy: 0 };
    });
    document.documentElement.classList.add("social-bar-on");
    bindMotion();
    bindStack();
  }

  function remount(patch) {
    window.SocialBarConfig = Object.assign({}, window.SocialBarConfig || {}, patch);
    mount(host && !ownedHost ? host : undefined);
  }

  window.SocialBar = {
    mount: mount,
    destroy: destroy,
    // e.g. setPosition("left") or setPosition({ desktop: "left", mobile: "bottom" })
    setPosition: function (value) {
      remount({ position: value });
    },
    setSide: function (side) {
      remount({ side: side === "left" ? "left" : "right" });
    },
    open: function () { setStackOpen(true, false); },
    close: function () { setStackOpen(false); },
    config: function () {
      return cfg ? JSON.parse(JSON.stringify(cfg)) : null;
    },
  };

  function boot() {
    if (document.body) mount();
    else document.addEventListener("DOMContentLoaded", function () { mount(); });
  }

  if (!MANUAL) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
  }
})();
