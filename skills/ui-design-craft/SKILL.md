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

1.  **User / Player & Core Acceptance Contract**: What must the user or player
    read, decide, or act on in under 3 seconds, and what **end-to-end
    acceptance criteria** must hold across the single working artifact (no
    partial/stubbed happy-path views)?
2.  **Aesthetic Thesis (Pick ONE aligned with medium & domain)**:
    *   *Web / SaaS*: Warm Editorial (Paper & Ink), Tactile Calm SaaS, Crisp
        Utility, or Monochrome + Single Signal Accent.
    *   *Desktop Native / Pro Tool*: Native Platform Precision (OS-aligned chrome,
        dense inspector panes, crisp hairlines, monospace data).
    *   *Mobile Native*: Ergonomic Tactile Minimalism (thumb-anchored actions,
        clear typographic hierarchy, fluid gesture sheets).
    *   *Video Game UI*: Diegetic / World-Integrated Framing, High-Contrast
        Tactical HUD, Stylized / Illustrative Menu, or Crisp Retro-Modern.
3.  **60-30-10 Color & Restraint Plan**: Use clean, high-clarity neutrals
    (crisp charcoal `#0E1013`–`#16191E` or warm alabaster `#FAF8F5`—avoid
    murky greenish/brownish dark surfaces) and **at most ONE focal accent**
    (10%) with contrast-verified foreground ink. Never put 3+ saturated neon
    status/rarity colors (`#4ade80` + `#38bdf8` + `#fb7185` + `#e09f3e`) on
    screen together—keep secondary tags muted/tonal.
4.  **Typography Pairing & Font Loading**: Separate **Display Font** (headings
    only, max 1–8 words) from **UI/Body Font** (legible everywhere, never put
    ornate/fantasy/display faces on `< 16px` copy or dense tables) + **Mono**
    for data/code/telemetry. Verify Latin-Extended/Turkish diacritic support
    (`line-height >= 1.12` on headings), actually import every declared webfont,
    use calibrated `400/500/600` weight contrast instead of `font-bold`
    everywhere, and apply `tabular-nums` to all metrics, prices, and HUD timers.
5.  **Open User-Friendly Layout & Custom SVG Plan**: Structure the viewport as
    clean, open split panes separated by hairline dividers—never nested boxes
    inside boxes, never duplicate the same items in stacked sections, and never
    clutter primary headers with QA/debug state toggles. Plan custom inline
    `<svg>` icons/silhouettes for visual anchors (items, nav, empty states). See
    [Layout & Domain Archetypes](./references/layout-and-domain-archetypes.md).

### Phase 3: Build with Anti-Slop Discipline

Consult the deep references matched to your task:

*   **Anti-Slop Replacements (Web, Desktop, Mobile, Games)**: [Anti-Slop Catalog](./references/anti-slop-catalog.md)
*   **Tokens, Color, Contrast & Typography**: [Design Tokens & Typography](./references/design-tokens-and-typography.md)
*   **Domain & Platform Architectures**: [Layout & Domain Archetypes](./references/layout-and-domain-archetypes.md)
*   **States, Accessibility, Input Parity & QA**: [States, A11y & Verification](./references/states-a11y-and-verification.md)
*   **Modern Research & Engineering Craft (2025–2026)**: [Modern Engineering & Research](./references/modern-engineering-and-research.md)

#### Non-Negotiable Red Lines (Never Ship These)

1.  **No AI Color Clichés, Murky Tints, or Neon Rainbow Overload**: Never default
    to `#0f172a` + indigo/purple/pink gradients (Tailwind or raw CSS), raw
    `#000000` / `bg-black` / `Colors.black` / `Color.black` surfaces (alpha
    backdrop scrims like `bg-black/70` excluded), murky green-black/brown-black
    midtones (`#141b18`, `bg-emerald-950`), muddy neon boxes (`bg-purple-500/20`),
    or `text-white` on bright yellow/amber/lime/cyan/emerald-400. Never mix 3+
    saturated neon status/rarity colors (hex or Tailwind `*-400/500`) on one
    screen—keep secondary tags understated and tonal.
2.  **No Typography Slop or Unloaded Fonts**: Never use unstyled Arial/Times,
    `font-bold` (`700`) monotony on every heading/button (use `400/500/600`
    contrast), or display/fantasy/sci-fi fonts on long body copy or dense tables.
    Never declare a webfont without actually importing it (`<link>`, `@import`,
    `@fontsource`, or `next/font`), and never clip Turkish diacritics (`İ, Ş, Ğ,
    Ü, Ö, Ç`) with `leading-none` / `line-height: 1` on headings or uppercase
    labels (keep `>= 1.12` / `>= 1.25`). Constrain prose to `55ch–68ch`.
3.  **No "Carditis" or Cluttered Non-UX Layouts**: Never stack bordered boxes
    inside bordered boxes, duplicate the same items in stacked sections, or
    pollute user-facing headers with QA/debug state-simulator buttons. Use open
    canvases, clean split panes with `1px` hairline dividers, clear visual
    focal priority, and generous breathing room.
4.  **Write Bespoke Inline `<svg>` Icons & Silhouettes (No Text-Only Stubs or Emojis)**:
    Never use `✨`, `🚀`, `⚡`, `🎉`, `💎`, Unicode icon surrogates (`📦`, `🛡️`),
    `<Sparkles>`, or bare text-only rectangles where visual recognition helps.
    Author clean, bespoke inline `<svg>` icons and domain silhouettes (e.g.,
    item/weapon/armor art, nav glyphs, empty-state linework) using
    `currentColor`, consistent `stroke-width: 1.5–1.75`, `aria-hidden="true"`
    when decorative, and `aria-label` on icon-only buttons. Never put rainbow
    pastel badges around icons.
5.  **No Semantic, Spatial-A11y, Form, or Motion Shortcuts**: Never use
    `<div onClick>` / `<span onClick>` instead of `<button type="button">` /
    `<a href>`, never use `outline-none` without a paired `focus-visible` ring,
    never omit `alt` on `<img>`, never build placeholder-only inputs without
    `<label>` or `aria-label`, never ship unlabeled icon-only buttons, never
    flatten visual groups into unstructured linear DOM (use `<section
    aria-labelledby>`, `<fieldset>`, and distinguishing item summaries), never
    use sluggish `duration-500`/`duration-700` transitions (`100ms–200ms`), and
    never add `@keyframes` without `@media (prefers-reduced-motion: reduce)`.
6.  **No Buzzword Copy or Toy Data**: Banish *"Supercharge"*, *"Seamless"*,
    *"Elevate"*, *"Next-gen"*, *"Revolutionize"*, *"AI-powered"*, *"Acme Corp"*,
    *"John Doe"*, *"Lorem ipsum"*, and synthetic `+20.1%` filler stats. Use
    domain-authentic copy and varied, realistic data.
7.  **No Broken Numeric Alignment**: Every price, counter, KPI, HP/timer/score,
    percentage, and table number must use `tabular-nums`.
8.  **No Medium Mismatch**:
    *   Desktop apps (`28–36px` toolbar controls, `800×600` min resize, `Ctrl/Cmd+K`)
        must not look like oversized web landing pages.
    *   Mobile apps (`>= 44pt/48dp` targets, `SafeArea`, `>= 16px` inputs to
        prevent iOS zoom) must not cram desktop tables or put key actions out of
        thumb reach.
    *   Game UIs (`5%` title-safe margin, scrims over gameplay, `>= 18–22px`
        1080p copy) must not look like Tailwind SaaS cards, clutter center-screen
        gameplay, or break gamepad/D-pad focus navigation.
9.  **No Single-State Prototypes, Silent Scope-Dropping, or Confusing Code**:
    Every view must handle empty, loading, error, long-text truncation
    (`min-w-0` + `truncate`), keyboard/gamepad focus, and target viewport
    scaling. Never commit *specification satisficing* (quietly downgrading or
    dropping requested interactivity) or write nested-ternary JSX soup; keep
    architecture/tokens and code co-evolving cleanly without duplicate logic.

### Phase 4: Self-Audit & Visual Verification

Before declaring any UI work done:

1.  **Automated Slop Scan & Code Review**: Run
    [audit_ui_slop.mjs](./scripts/audit_ui_slop.mjs)
    (`node <skill_dir>/scripts/audit_ui_slop.mjs --strict <path>`, or `--json`
    for CI/tooling) on created/modified UI files and audit against the red lines
    above. Use `ui-craft-ignore` (line) or `ui-craft-ignore-file` (file) only
    for justified exceptions, or project-level `.uicraftrc.json` (`disabledRules`,
    `ignorePaths`, `allowFonts`). Strip excess card wrappers, dead handlers,
    toy copy, and uncalibrated shadows.
2.  **Anti-Satisficing, Invariant & Scope Diff Check**: Re-check the final
    artifact against every requirement in the prompt (spec-driven invariants,
    end-to-end flows, zero duplicated logic or unintended module drift).
3.  **Layout & Overflow Check**: Check truncation (`min-w-0`), aspect ratios,
    safe-area/overscan margins, and narrow/resized extremes.
4.  **Live Visual & Input Inspection**: Inspect rendered output using the
    verification steps in [States, A11y & Verification](./references/states-a11y-and-verification.md)
    (desktop + mobile viewports for web/mobile, window resize & keyboard pass
    for desktop, background-contrast & controller-focus pass for game UI).
