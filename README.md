# Handoff: AI勉強会 WEB資料 (AI Study Group Microsite)

## Overview
A Japanese-language internal-training microsite for a 10-session / 4-chapter "AI Study Group" program (AIエージェントチームで実現する組織のAI化). It has:
- One long-scroll landing page (`index.html`) with a cinematic scroll-driven intro, a roadmap grid linking to all 10 sessions, and full session content grouped into 4 chapters.
- 40 standalone "topic detail" pages (`pages/*.html`), one per keyword/concept referenced from the landing page, sharing a common stylesheet (`styles/detail.css`).

This is a content/reference site, not an app — there is no backend, form submission, or state beyond scroll position and a hamburger nav toggle.

## About the Design Files
The files in this bundle are **HTML/CSS design references**, not production code to copy directly. They were built as static prototypes to show intended look, content, and scroll behavior. The task is to **recreate this design in the target codebase's existing environment** (e.g. a static site generator, CMS, or whatever framework the team already uses) using its established patterns — or, if no environment exists yet, choose the most appropriate lightweight static-site approach and implement the designs there. Given the site is 100% static informational content in Japanese with no dynamic data, a plain static-site generator (Astro, 11ty, or even hand-authored HTML/CSS) is likely more appropriate than a heavy SPA framework — recommend confirming with the team before over-engineering.

## Fidelity
**High-fidelity.** All colors (as OKLCH values), typography, spacing, and copy in the HTML are final and should be recreated pixel-for-pixel. Scroll animations and interaction behavior described below are also intentional and should be preserved.

## Site Structure
```
index.html              — long-scroll landing page (all styles inline in <style>, all JS inline in <script>)
styles/detail.css        — shared stylesheet for all 40 detail pages (variables + components)
pages/*.html (40 files)  — one detail page per topic, each has its own small <style> block for page-specific diagrams on top of detail.css
archive/index-v1.html    — an earlier draft, not part of the live site (do not build from this)
index-classic.html       — a non-cinematic fallback/alternate version of the homepage without scroll animation (confirm with stakeholder whether this is still needed)
uploads/AI勉強会.md       — source content brief the site was built from
```

## Design Tokens
Defined as CSS custom properties in both `index.html` and `styles/detail.css` (`:root`), all in OKLCH:
- `--bg: oklch(0.985 0.004 85)` — page background (warm off-white)
- `--bg-alt: oklch(0.965 0.006 80)` — alternate section background (used on even chapters)
- `--paper: oklch(0.995 0.003 85)` — card/surface background
- `--ink: oklch(0.20 0.012 60)` — primary text / dark section background
- `--ink-soft: oklch(0.38 0.014 60)` — secondary text
- `--muted: oklch(0.58 0.010 70)` — tertiary/label text
- `--hair: oklch(0.88 0.008 75)` — hairline borders
- `--hair-strong: oklch(0.78 0.012 70)` — stronger borders/dividers
- `--accent: oklch(0.52 0.135 35)` — brand accent (warm terracotta/orange), used for eyebrows, links, highlights
- `--accent-soft: oklch(0.94 0.030 40)` — accent tint background (highlighted text bg, tag chips)

Typography (Google Fonts, loaded via `<link>`):
- `--serif`: "Noto Serif JP" (weights 500/700/900) — all headings, quotes, emphasis
- `--sans`: "Noto Sans JP" (weights 400/500/700) — body text, nav
- `--mono`: "JetBrains Mono" (weights 400/500) — eyebrows/labels/timestamps/HUD text, all uppercase with wide letter-spacing (0.08–0.24em)

Spacing/scale: content max-width `min(1680px, 92vw)`, section padding typically 96–120px vertical / 32px horizontal on desktop, collapsing to 16–24px on mobile (`@media max-width: 768px` — a fairly extensive separate mobile ruleset exists, do not skip it).

No border-radius is used anywhere — the design is deliberately square/hairline-bordered ("editorial/dossier" aesthetic), not a rounded-card SaaS look.

## Screens / Views

### 1. Landing page (`index.html`)
**Purpose:** Introduce the program, communicate the "tool → team member" thesis, and route the reader into any of the 10 sessions.

**Top nav** (`.topnav`): fixed, translucent/blurred bar, hidden until user scrolls past the cinematic intro (desktop only — appears via `.show` class toggled by scroll position). Contains a small square brand mark ("AI"), program name, 6 anchor links (roadmap + 4 chapters + closing), and a monospace meta label ("全10回 / 4章構成"). On mobile (≤768px) the nav is always visible and collapses links into a hamburger-toggled dark dropdown drawer.

**Cinematic intro** (desktop only, `.cinema`, hidden entirely on mobile in favor of a static `.mobile-hero`): two full-viewport "scroll-scrubbed" scenes pinned via `position: sticky` inside tall wrapper divs (200vh and 300vh), driven by a scroll-progress CSS variable `--p` (0→1) computed per-element in JS (see Interactions below):
- **Scene 1 (cold open):** dark hero with animated `<canvas>` neural-network background, rotating SVG orbital rings, falling "data stream" lines, a mouse-follow spotlight, HUD-style corner brackets + readouts (live clock, node count, scroll cue), and the main H1 title with a glowing accent word. Fades/slides out as you scroll.
- **Scene 2 (the big shift):** center-aligned statement "AIは便利なツール → 自律するチームメンバーへ" with the "tool" phrase getting a strikethrough and fading while "team member" fades in in accent color, on a background of two mirrored SVG circuit-trace diagrams (cool blue = old, warm accent = new) that grow a connecting bridge in the middle as progress advances.

**Roadmap section** (`#roadmap`): eyebrow + big serif title + lede paragraph (2-col grid), a 4-stat strip (04 Chapters / 10 Sessions / 40 Topics / 2026 Updated), a horizontal 10-node timeline graphic connected by a progress line, then a 4-column grid of "chapter cards" (`.rm-chapter`) each with a small hand-drawn-style SVG glyph, chapter number/title, and a list of session links.

**Chapter sections** (×4, alternating `--bg`/`--bg-alt` background): each starts with a `.ch-banner` — a huge serif chapter number (up to 140px) beside a title + lede, with a faint decorative SVG node-grid (`.ch-ambient`) bleeding off the right edge. Each chapter contains 2–3 **session articles** (`.session`), laid out as a sticky left rail (session number, category tag chip, title) + a right content column made of labeled blocks (`.sb-block`): 目的 (purpose), アジェンダ (agenda — list of `.struct-item` cards, each linking to a `pages/*.html` detail page), 具体例/ライブデモ (worked examples in a dark inset card `.sb-example`, sometimes with Bad/Good quote comparisons), and キーワード (keyword chip tags `.kw`). Some sessions substitute a 4-step "evolution" diagram (`.diagram-evolve`) or a numbered flow diagram (`.flow`) for the agenda.

**Closing section** (`#closing`): dark full-bleed band, 2-col grid — big serif statement on the left, supporting text + a list of action links (each prefixed with a ↗ icon) on the right, over a dim animated particle-network `<canvas>` (`#closingCanvas`).

**Footer:** centered monospace copyright line.

### 2. Mobile hero (`.mobile-hero`, ≤768px only)
Static (non-scroll-scrubbed) replacement for the whole cinematic intro: dark hero with the same radial-gradient/grid background treatment, eyebrow, title, sub, a compact "tool → team member" line, a 3-item meta row (chapters/sessions/topics), and a CTA button linking to `#roadmap`.

### 3. Detail pages (`pages/*.html`, 40 total)
**Purpose:** Deep-dive on a single concept/keyword referenced from a session's agenda list (e.g. `ai-agent.html`, `rag.html`, `mcp.html`, `governance.html`).

**Shared layout** (from `styles/detail.css`):
- Sticky top nav with a "← AI勉強会" back-link to `../index.html` and a breadcrumb (chapter/session → current topic).
- `.hero-detail`: 2-col grid, eyebrow (session/category) + big serif H1 (with an accent-colored emphasized clause) on the left, a lede paragraph with a left accent border on the right.
- Optional `.hero-illust`: a labeled SVG concept diagram (e.g. the agent's tool-radiating diagram, ReAct loop, pipeline stages) — hand-built SVG, not photographic.
- `.metaphor`: full-bleed dark band with a single large pull-quote-style sentence framing the concept in plain language ("in one sentence").
- One or more `.section` blocks: label + heading + sub, followed by a diagram (`.diagram`, `.diagram-flow`, `.react-loop`, etc.), code/trace-style dark monospace panels (`.trace`), or comparison content — the exact composition varies per topic; read each page's own `<style>` block for page-specific diagram markup before rebuilding it.

Each of the 40 pages is independent content but must be rebuilt using the **same shared detail-page shell/components** — do not treat them as 40 unrelated designs.

## Interactions & Behavior
All behavior is vanilla JS (no framework), defined inline at the bottom of `index.html`:
- **Scroll progress bar** (`#scrollProg`): thin accent bar across the very top, width = overall page scroll %.
- **Top nav reveal**: `.topnav.show` toggled once the user scrolls past the cinematic intro's height; smooth opacity/translateY transition. On mobile this is disabled — nav is always shown.
- **Cinematic scroll-scrubbing**: each `.scene-wrap` is a tall (`200vh`/`300vh`) container with a `position: sticky` scene inside. A per-element `--p` (0→1) custom property is computed from each element's own bounding-rect position (element top crossing between 90% and 40% of viewport height, with an optional negative stagger offset for siblings) and written via `element.style.setProperty('--p', ...)` on scroll/resize (rAF-throttled). CSS reads `--p` to drive opacity/transform/blur/width for dozens of elements (`[data-anim="fade|slide-left|slide-right|scale|blur-up|lift|glow-in"]`, chapter numbers, timeline progress line, closing heading letter-spacing, ambient SVG opacity, etc). This system applies site-wide, not just in the two cinema scenes.
- **Neural canvas** (`#neuralCanvas`, scene 1) and **closing canvas** (`#closingCanvas`): 2D-canvas particle networks (nodes drifting, connecting lines drawn when within a distance threshold, glow pulse), paused via `IntersectionObserver` when off-screen.
- **Mouse spotlight** (scene 1 only): a radial-gradient overlay whose CSS position vars (`--mx`, `--my`) follow the pointer, fading in on first mousemove.
- **HUD readouts**: a live JST clock (`#hudClock`, updates every second) and a fake "neural mesh node count" — cosmetic, not real data.
- **AI signals ticker** (`#aiSignals`, bottom-right fixed pill): cycles through ~7 canned status strings every 3s with a fade transition; only visible while scrolled within the cinema area (not during scene 1 itself).
- **Mobile hamburger nav** (`#navToggle` / `#topnavLinks`): toggles a `.open` class that slides a full-width dark link list down from under the nav bar; closes on link click, outside click, or resize to desktop width.
- **Active-section nav highlighting**: an `IntersectionObserver` (rootMargin `-40% 0 -50% 0`) watches each anchor target and colors the matching top-nav link `--accent` while its section is in view.
- **Reduced-motion / mobile**: on `max-width: 768px`, `body.is-animated` scroll-driven transforms are forcibly reset to `opacity:1 / transform:none` — mobile is intentionally static, not scroll-scrubbed, for performance and readability.
- **Detail pages** have no JS beyond what's inherited from being plain static HTML — they are not scroll-animated.

## State Management
No app state. The only "state" is:
- Scroll position (read-only, drives `--p` and nav visibility — not persisted).
- Mobile nav open/closed (transient DOM class, not persisted).
- Hash-based in-page navigation (`#session-N`, `#chapter-N`) and cross-page links to `pages/*.html` — plain anchor links, no router.

## Assets
- Google Fonts: Noto Sans JP, Noto Serif JP, JetBrains Mono (loaded via `fonts.googleapis.com` — recreate with the same CDN or self-host equivalents).
- No photographic imagery anywhere. All diagrams/illustrations are hand-authored inline SVG (concept diagrams, node graphs, glyphs) — treat these as content to recreate in code, not images to extract.
- `uploads/AI勉強会.md` is the original content brief/outline the copy was authored from — useful for the developer to cross-check session content completeness.
- `debug-crop.png` and everything in `screenshots/` are working/QA artifacts from building this design, not site assets — do not include them in the rebuilt site.

## Files Included in This Bundle
- `index.html` — the landing page
- `styles/detail.css` — shared detail-page stylesheet
- `pages/` — all 40 detail pages
- `uploads/AI勉強会.md` — original content brief

Not included (intentionally, per the notes above): `archive/`, `screenshots/`, `debug-crop.png`, `index-classic.html`. Ask the design owner if `index-classic.html` (a non-animated fallback homepage) should also ship — it wasn't clear from context whether it's still in use.
