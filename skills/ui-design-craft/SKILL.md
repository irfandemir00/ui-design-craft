---
name: ui-design-craft
description: >-
  Universal UI/UX design craft and anti-AI-slop system across ALL platforms and
  visual mediums: web apps and sites (HTML/CSS, Tailwind, React, Next.js, Vue,
  Svelte, Astro, Generative UI), desktop applications (Electron, Tauri, Qt,
  WPF/WinUI, SwiftUI/macOS, GTK), mobile apps (iOS, Android, React Native,
  Flutter), and video game interfaces (HUDs, menus, inventories, skill trees,
  dialogue systems across Unity, Unreal, Godot, or custom engines). Enforces
  platform-native ergonomics, intentional aesthetic direction, calibrated
  color/typography/spacing, realistic copy, complete interaction states, and
  visual verification so interfaces never look like generic AI templates.
---

# UI Design Craft (Anti-AI-Slop System)

Generic AI UI happens when implementation starts immediately from statistical
web-template defaults: dark-slate backgrounds with purple-indigo gradients,
identical 3-column Tailwind card grids, sparkle emojis, hollow marketing
buzzwords, and missing interaction states—even when building a native desktop
tool, a mobile app, or a video game menu. This skill replaces template reflexes
with platform-accurate, production-grade design engineering.

---

## Mandatory Workflow

Follow these four phases for **every** UI task across web, desktop, mobile, and
video games.

### Phase 1: Medium, Context & Scope Check

Identify the target medium first and respect its native idioms:

*   **Existing Codebase / Design System**: Inspect existing tokens, theme files,
    component primitives, or engine styles first. Extend and elevate the
    established visual language—never introduce clashing fonts, parallel styling
    frameworks, or mismatched UI kits unless asked for a redesign.
*   **Web / Webviews**: Establish semantic CSS tokens (canvas, surface, border,
    text hierarchy, single primary accent, semantic states) before markup.
*   **Inline Chat / Generative UI Artifacts**: Use host-injected CSS variables
    (`--card`, `--foreground`, `--muted-foreground`, `--border`, `--primary`)
    rather than hardcoded light/dark colors, while keeping all typography,
    layout, restraint, and state discipline below.
*   **Desktop Applications (Electron, Tauri, Qt, WinUI, SwiftUI, GTK)**: Design
    for window resizing, multi-pane splitters, compact toolbars (`28px–36px`
    controls), status bars, and keyboard-first workflows—never ship a marketing
    webpage trapped inside a desktop window.
*   **Mobile Applications (iOS, Android, React Native, Flutter)**: Design for
    thumb-zone reachability, safe areas/notches, `>= 44pt / 48dp` touch targets,
    native sheets/tabs, and vertical density—never ship a shrunk desktop grid.
*   **Video Game Interfaces (HUDs, Menus, Inventories, Dialogue)**: Design for
    world-tone cohesion, contrast over moving gameplay, 10-foot/handheld
    legibility, center-screen clarity, and simultaneous Mouse/KB + Gamepad
    navigation—never drop generic white/slate SaaS cards into a game.

### Phase 2: Pre-Code Design Brief (Required Before Writing UI Code)

Before writing UI code, lock in five concrete decisions:

1.  **User / Player & Core Task**: What must the user or player read, decide, or
    act on in under 3 seconds?
2.  **Aesthetic Thesis (Pick ONE aligned with medium & domain)**:
    *   *Web / SaaS*: Warm Editorial (Paper & Ink), Tactile Calm SaaS, Crisp
        Utility, or Monochrome + Single Signal Accent.
    *   *Desktop Native / Pro Tool*: Native Platform Precision (OS-aligned chrome,
        dense inspector panes, crisp hairlines, monospace data).
    *   *Mobile Native*: Ergonomic Tactile Minimalism (thumb-anchored actions,
        clear typographic hierarchy, fluid gesture sheets).
    *   *Video Game UI*: Diegetic / World-Integrated Framing, High-Contrast
        Tactical HUD, Stylized / Illustrative Menu, or Crisp Retro-Modern.
3.  **60-30-10 Color & Undertone Plan**: Choose tinted neutrals matched to the
    domain undertone (warm paper/espresso vs. cool zinc/graphite vs. mineral
    sage—never raw `#000000` or cold `slate` paired with warm accents). Reserve
    **one** primary focal accent (10%) with contrast-verified foreground ink
    (never white text on bright amber/lime/cyan), and lock green/amber/red
    strictly to real status/vitals.
4.  **Typography Pairing & Font Loading**: Separate **Display Font** (headings
    only, max 1–8 words) from **UI/Body Font** (legible everywhere, never put
    ornate/fantasy/display faces on `< 16px` copy or dense tables) + **Mono**
    for data/code/telemetry. Verify Latin-Extended/Turkish diacritic support
    (`line-height >= 1.12` on headings), actually import every declared webfont,
    use calibrated `400/500/600` weight contrast instead of `font-bold`
    everywhere, and apply `tabular-nums` to all metrics, prices, and HUD timers.
5.  **Layout & Input Grammar**: Select a structure built for the medium and
    input devices (mouse/keyboard, touch, or gamepad). See
    [Layout & Domain Archetypes](./references/layout-and-domain-archetypes.md).

### Phase 3: Build with Anti-Slop Discipline

Consult the deep references matched to your task:

*   **Anti-Slop Replacements (Web, Desktop, Mobile, Games)**: [Anti-Slop Catalog](./references/anti-slop-catalog.md)
*   **Tokens, Color, Contrast & Typography**: [Design Tokens & Typography](./references/design-tokens-and-typography.md)
*   **Domain & Platform Architectures**: [Layout & Domain Archetypes](./references/layout-and-domain-archetypes.md)
*   **States, Accessibility, Input Parity & QA**: [States, A11y & Verification](./references/states-a11y-and-verification.md)

#### Non-Negotiable Red Lines (Never Ship These)

1.  **No AI Color Clichés or Broken Contrast**: Never default to `#0f172a`/`#09090b`
    + indigo/purple/pink gradients, raw `#000000` backgrounds, muddy neon
    translucent boxes (`bg-purple-500/20 border-purple-500/40`), or `text-white`
    on bright yellow/amber/lime/cyan/emerald-400 buttons. Always harmonize
    neutral undertones with the accent.
2.  **No Typography Slop or Unloaded Fonts**: Never use unstyled Arial/Times,
    blind `Inter`+`font-bold` monotony, or display/fantasy/sci-fi fonts on
    long body copy or dense tables. Never declare a webfont without actually
    importing it (`<link>` / `@import` / `@fontsource`), and never clip Turkish
    diacritics (`İ, Ş, Ğ`) with `leading-none`.
3.  **No "Carditis" (Boxes Inside Boxes)**: Do not wrap every group of labels or
    stats in identical rounded-2xl shadowed cards. Use whitespace, structural
    split panes, and hairline dividers (`1px solid`).
4.  **No Rainbow Icon Badges**: Never color-code unrelated tiles with arbitrary
    pastel blue/purple/green/orange icon circles.
5.  **No Sparkle / Emoji Crutches**: Never put `✨`, `🚀`, `⚡`, or `Sparkles`
    icons on buttons, headings, or badges as generic decoration.
6.  **No Buzzword Copy or Toy Data**: Banish *"Supercharge"*, *"Seamless"*,
    *"Elevate"*, *"Next-gen"*, *"Acme Corp"*, *"John Doe"*, and synthetic
    `+20.1%` filler stats. Use domain-authentic copy and varied, realistic data.
7.  **No Broken Numeric Alignment**: Every price, counter, KPI, HP/timer/score,
    percentage, and table number must use `tabular-nums`.
8.  **No Medium Mismatch**:
    *   Desktop apps must not look like oversized web landing pages.
    *   Mobile apps must not cram desktop tables or put key actions out of thumb reach.
    *   Game UIs must not look like Tailwind SaaS cards, clutter center-screen
        gameplay, or break gamepad/D-pad focus navigation.
9.  **No Single-State Prototypes**: Every view must handle empty, loading,
    error, long-text truncation (`min-w-0`), keyboard/gamepad focus, and
    target viewport/aspect-ratio scaling.

### Phase 4: Self-Audit & Visual Verification

Before declaring any UI work done:

1.  **Automated Slop Scan & Code Review**: Run
    [audit_ui_slop.mjs](./scripts/audit_ui_slop.mjs) (`node <skill_dir>/scripts/audit_ui_slop.mjs <path>`)
    on created/modified UI files and audit against the red lines above; strip
    excess card wrappers, dead handlers, toy copy, and uncalibrated shadows.
2.  **Layout & Overflow Check**: Check truncation (`min-w-0`), aspect ratios,
    safe-area/overscan margins, and narrow/resized extremes.
3.  **Live Visual & Input Inspection**: Inspect rendered output using the
    verification steps in [States, A11y & Verification](./references/states-a11y-and-verification.md)
    (desktop + mobile viewports for web/mobile, window resize & keyboard pass
    for desktop, background-contrast & controller-focus pass for game UI).
