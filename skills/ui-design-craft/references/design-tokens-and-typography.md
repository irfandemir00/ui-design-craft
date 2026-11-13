# Color Theory, Tokens & Typography Craft

AI-generated interfaces fail most visibly in **color** (cold dead grays,
neon-purple gradients, clashing hues, broken contrast) and **typography**
(blind `Inter` monotony, unloaded webfonts falling back to Arial, ornate
display fonts on unreadable 12px body text, or broken Turkish/accented glyphs).
Follow these rules rigorously before writing a single component.

---

## 1. Color Craft: Undertones, Harmony & Contrast

### Rule A: Match Neutral Undertones (Never Use "Dead" Gray)

Pure neutral gray (`#808080`) or cold Tailwind `slate` (`#0f172a`, `#64748b`)
looks sterile and synthetic—especially when paired with warm accents. **Every
neutral scale must carry a deliberate subtle undertone**:

*   **Warm Paper / Sand / Charcoal** (Editorial, Finance, Consumer, Craft):
    Canvas `#FAF8F5`, Surface `#FFFFFF`, Subtle `#F1EDE4`, Dark `#141312`, Ink `#1C1917`
*   **Mineral / Cool Zinc** (Productivity, B2B SaaS, Neutral Utility):
    Canvas `#F8F9FA`, Surface `#FFFFFF`, Subtle `#EEF0F3`, Dark `#111214`, Ink `#111318`
*   **Obsidian / Graphite** (DevTools, Audio/Video, Tactical Consoles, Dark UI):
    Canvas `#0E1013`, Surface `#15181D`, Elevated `#1D2128`, Hairline `rgba(255,255,255,0.08)`
*   **Organic / Light Sage** (Climate, Health, Outdoor — light mode only):
    Canvas `#F5F6F3`, Surface `#FCFDFB`, Ink `#182019`

*Never use raw `#000000` (`bg-black`, `Colors.black`, `Color.black`) as a solid UI
surface (alpha backdrop scrims such as `bg-black/70` or `rgba(0,0,0,0.65)` are
acceptable), and never invent muddy dark-green (`#141b18`, `#0d1a14`,
`bg-emerald-950`) or murky teal-black surfaces—keep dark mode neutrals clean,
crisp, and low-chroma (`#0E1013`–`#1D2128`), or intentional warm espresso
(`#12100E`). Avoid stark `#FFFFFF` on long reading surfaces (`#FCFCFA` or
`#FAF8F5` is far easier on the eye).*

### Rule B: Strict 60-30-10 & Max-Hue Discipline

*   **60% Canvas**: Calm background where eyes rest.
*   **30% Structural Surfaces & Chrome**: Sidebars, headers, tables, input wells,
    bounded by subtle `1px` hairline borders (`--border-subtle`).
*   **10% Single Focal Accent**: **One** primary accent (`--accent`) used ONLY
    for primary CTAs, active selections, and focus rings.
*   **Hard Cap on Simultaneous Saturated Hues**: Never place 3+ bright neon
    colors (`#4ade80` green + `#38bdf8` cyan + `#fb7185` pink + `#e09f3e` amber)
    on one screen. Keep rarity/category tags **tonal and understated** (muted
    ash `#8C939E`, brushed bronze `#A88B6A`, steel `#93A8BE`, warm gold `#D4A14A`
    with subtle alpha borders) and reserve vivid green/red strictly for small
    inline numeric deltas (`+14`, `-3`) or real error alerts.

### Rule C: Contrast-Verified Accent Pairings (Never Fail WCAG AA)

A classic AI bug is putting white text on bright emerald, amber, lime, or cyan
buttons (`< 3.0:1` contrast). Pair every accent with its calibrated ink:

*   **White ink (`#FFFFFF`) ONLY on dark/deep accents**:
    Cobalt `#1D4ED8`, Deep Teal `#0F766E`, Terracotta `#B8432B`, Crimson `#B91C1C`,
    Forest `#166534`, Charcoal Ink `#141416`.
*   **Dark ink (`#09090B` / `#141210`) on bright/signal accents**:
    Amber Gold `#EAB308` / `#F59E0B`, Signal Lime `#84CC16`, Bright Cyan `#22D3EE`,
    Sand Gold `#D4A373`.
*   **Ban Muddy Neon Translucent Boxes**: Avoid `bg-indigo-500/20 border-indigo-500/40`
    or `bg-purple-500/15` wrappers. Use crisp tonal surfaces with low-alpha
    neutral borders instead.

### Rule D: 8 Ready-to-Use Calibrated Palette Systems

Pick ONE aligned to your medium and domain—never default to dark-slate + indigo:

1.  **Editorial Paper & Terracotta (Publishing, Portfolios, Legal, Writing)**
    `--bg-canvas: #FAF8F5` · `--bg-surface: #FFFFFF` · `--bg-subtle: #F1ECE3` ·
    `--border-subtle: #E4DDD0` · `--text-primary: #1B1917` · `--text-muted: #6E675F` ·
    `--accent: #B8432B` (`--accent-fg: #FFFFFF`)
2.  **Crisp Cobalt Utility Light (B2B SaaS, Operations, Project Tools)**
    `--bg-canvas: #F7F8FA` · `--bg-surface: #FFFFFF` · `--bg-subtle: #EFF1F5` ·
    `--border-subtle: rgba(17,24,39,0.09)` · `--text-primary: #111318` · `--text-muted: #5F6672` ·
    `--accent: #1D4ED8` (`--accent-fg: #FFFFFF`)
3.  **Nordic Sage & Pine (Fintech, Wellness, Sustainability, Banking)**
    `--bg-canvas: #F6F7F5` · `--bg-surface: #FFFFFF` · `--bg-subtle: #EBF0EC` ·
    `--border-subtle: #D9E0DA` · `--text-primary: #131B16` · `--text-muted: #55635A` ·
    `--accent: #165B45` (`--accent-fg: #FFFFFF`)
4.  **Monochrome Swiss + Vermilion (Design Tools, Architecture, Docs)**
    `--bg-canvas: #FFFFFF` · `--bg-surface: #FAFAFA` · `--bg-subtle: #F2F2F3` ·
    `--border-subtle: #E4E4E7` · `--text-primary: #09090B` · `--text-muted: #696972` ·
    `--accent: #DC2626` (`--accent-fg: #FFFFFF`)
5.  **Graphite Precision Dark (DevTools, IDE, Analytics, Desktop Studio)**
    `--bg-canvas: #0D0F12` · `--bg-surface: #14171C` · `--bg-subtle: #1C2028` ·
    `--border-subtle: rgba(255,255,255,0.08)` · `--text-primary: #F1F3F5` · `--text-muted: #8B93A1` ·
    `--accent: #3B82F6` (`--accent-fg: #FFFFFF`)
6.  **Warm Espresso Dark (Creative Apps, Music/Audio, Photography)**
    `--bg-canvas: #12100E` · `--bg-surface: #1B1815` · `--bg-subtle: #25211D` ·
    `--border-subtle: rgba(255,245,235,0.09)` · `--text-primary: #F5F1EB` · `--text-muted: #9D9488` ·
    `--accent: #E07A38` (`--accent-fg: #12100E`)
7.  **Tactical Sci-Fi HUD (Shooters, Mech, Space Sim, Strategy Games)**
    `--bg-scrim: rgba(9,13,18,0.78)` · `--bg-panel: #111821` ·
    `--border-rim: rgba(148,197,255,0.22)` · `--text-primary: #EEF5FC` · `--text-muted: #8FA6BF` ·
    `--accent: #38BDF8` (`--accent-fg: #08121B`) · `--alert: #F59E0B`
8.  **Weathered Parchment & Iron (RPG, Medieval, Fantasy Game Menus)**
    `--bg-scrim: rgba(15,13,11,0.84)` · `--bg-panel: #1A1612` ·
    `--border-rim: rgba(212,175,112,0.28)` · `--text-primary: #F2EAD9` · `--text-muted: #A69882` ·
    `--accent: #D4A14A` (`--accent-fg: #14110D`) · `--vital-hp: #B9382C`

> **Generative UI Exception**: Inside Antigravity inline chat artifacts, map
> directly to host variables (`--card`, `--foreground`, `--muted-foreground`,
> `--border`, `--primary`) instead of hardcoding `:root` overrides.

---

## 2. Elevation & Borders (Light vs. Dark)

*   **Light Mode**: Pair a `1px` hairline border with a soft two-step shadow:
    ```css
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 16px rgba(15, 23, 42, 0.03);
    ```
*   **Dark Mode**: Shadows vanish on dark canvases. Use **tonal surface stepping**
    (`#0D0F12` -> `#14171C` -> `#1C2028`) with faint `1px` edge highlights
    (`rgba(255,255,255,0.08)`). Never draw bright white borders on dark panels.
*   **Radius Harmony**: Pick one corner family per product (`4–6px` for technical/desktop,
    `8–12px` for SaaS/mobile, sharp/chamfered for tactical games) and obey
    `innerRadius = max(2px, outerRadius - padding)`.

---

## 3. Typography Craft: Pairings, Voice & Real Loading

### Rule A: Separate Display Voice from UI/Body Legibility

*   **Display Font (Headings >= 24px, max 1–8 words)**: Carries brand/world
    personality.
*   **UI / Body Font (Paragraphs, labels, tables, inputs, tooltips)**: Must
    optimize pure legibility at `12px–17px`. **NEVER** put ornate serif,
    fantasy, pixel, or geometric-display fonts (`Cinzel`, `Space Grotesk`,
    `Chakra Petch`, `Syne`, `Fraunces`, `Instrument Serif`) on long body copy,
    form fields, or dense stat tables!

### Rule B: Curated Font Pairings (All Verified with Latin-Extended / Turkish Support)

Every Google Font below supports Turkish diacritics (`Ğ, ğ, Ü, ü, Ş, ş, İ, ı, Ö, ö, Ç, ç`)
so accented characters never fall back to mismatched Arial glyphs:

| Domain / Medium | Display / Heading Font | UI / Body Font | Mono / Data Font |
| :--- | :--- | :--- | :--- |
| **Editorial / Magazine / Legal** | `Newsreader` or `Instrument Serif` | `Plus Jakarta Sans` or `DM Sans` | `IBM Plex Mono` |
| **Warm Consumer / Brand / Studio** | `Fraunces` (soft serif) or `Bricolage Grotesque` | `Plus Jakarta Sans` or `Manrope` | `JetBrains Mono` |
| **Modern SaaS / B2B Product** | `Plus Jakarta Sans` or `Outfit` | `Inter` or `IBM Plex Sans` | `JetBrains Mono` |
| **DevTool / Technical / Fintech** | `IBM Plex Sans` or `Space Grotesk` (headings only) | `IBM Plex Sans` or `Inter` | `JetBrains Mono` or `IBM Plex Mono` |
| **Desktop Native App** | OS System (`-apple-system`, `Segoe UI Variable`) | Same OS System font | `JetBrains Mono` / `Cascadia Mono` |
| **Mobile Native App** | `SF Pro` (iOS) / `Roboto` / `Plus Jakarta Sans` | `SF Pro` / `Roboto` / `DM Sans` | `SF Mono` / `JetBrains Mono` |
| **Sci-Fi / Tactical Game UI** | `Chakra Petch` or `Rajdhani` | `IBM Plex Sans` or `Inter` | `JetBrains Mono` |
| **Fantasy / RPG Game UI** | `Cinzel` or `Cormorant Garamond` | `Plus Jakarta Sans` or `Lora` (large) | `IBM Plex Mono` |

### Rule C: Never Declare an Unloaded Webfont

If you specify `'Plus Jakarta Sans'`, `'IBM Plex Sans'`, `'Newsreader'`, etc. in
a web HTML/CSS/React project, **you MUST include the actual font import** (Google
Fonts `<link>` with `&subset=latin,latin-ext`, `@import url(...)`, local
`@fontsource/*` package, or `next/font/google`) with `display=swap`, plus clean
fallbacks:
`font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;`

### Rule D: Weight Ladder & Optical Calibration

Stop putting `font-bold` (`700`) on every heading, card title, and button:

1.  **Use Weight + Ink Contrast Together**:
    *   Display Hero (`36px–56px`): `font-weight: 500` or `600`, `letter-spacing: -0.025em`, `line-height: 1.12`.
    *   Section Title (`20px–26px`): `font-weight: 600`, `letter-spacing: -0.015em`, `line-height: 1.22`.
    *   Card / Panel Header (`14px–16px`): `font-weight: 600`, `letter-spacing: -0.005em`.
    *   Body Copy (`14px–16px`): `font-weight: 400`, `line-height: 1.55–1.65`, `max-width: 65ch`.
    *   Uppercase Micro-Label (`11px–12px`): `font-weight: 600`, `letter-spacing: +0.05em`, `line-height: 1.3`.
2.  **Diacritic Safety**: Never set `line-height < 1.12` on headings or `< 1.25`
    on uppercase labels so `İ, Ş, Ğ, Ü, Ö, Ç` accents never clip.
3.  **Tabular Numerals**: Apply `font-variant-numeric: tabular-nums` on every
    price, KPI, percentage, timestamp, timer, HP/ammo counter, and table column.
4.  **Balanced Wrapping**: Apply `text-wrap: balance` on headings and
    `text-wrap: pretty` on body paragraphs.

---

## 4. Platform-Specific Density & Contrast Tokens

### Desktop Applications (Electron, Tauri, Qt, WinUI, SwiftUI)
*   **Controls**: Compact `28px–32px` toolbar/input height (`36px` max primary CTA).
*   **Typography**: `13px` UI body, `11px–12px` status bar/shortcuts, `15px–18px` section headers.

### Mobile Applications (iOS, Android, React Native, Flutter)
*   **Touch Targets**: Minimum `44×44pt` (iOS) / `48×48dp` (Android) with `>= 8px` gap.
*   **Typography**: `15px–17px` body (`>= 16px` on inputs to prevent iOS zoom), `12px–13px` captions.
*   **Safe Areas**: Enforce `env(safe-area-inset-*)` / native `SafeArea` / `WindowInsets`.

### Video Game Interfaces (1080p Baseline, Scalable for TV / Handheld)
*   **Safe-Zone Margins**: Keep HUD inside a **5% title-safe margin**.
*   **Live-Backdrop Scrim**: Never place raw text directly over gameplay—protect
    with dark scrim (`rgba(8,10,14,0.75)`) or subtle dark outline/shadow.
*   **1080p Viewing Scale**: Subtitles/descriptions `22px–28px` (never `< 18px` on
    TV/handheld), HUD vitals `24px–36px` `tabular-nums`, Menu options `24px–30px`.

---

## 5. Spacing Rhythm (Law of Proximity)

Use a 4px/8px scale (`4, 8, 12, 16, 24, 32, 48, 64, 96px`):
*   **Label <-> Control / Title <-> Subtitle**: `4px–8px`
*   **Sibling Items**: `12px–16px`
*   **Panel Padding**: `16px–24px` (`12px–16px` in dense desktop/game inspectors)
*   **Distinct Sections**: `48px–96px`
