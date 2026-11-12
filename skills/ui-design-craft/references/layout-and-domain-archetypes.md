# Layout Grammars & Domain Archetypes

Choose the layout architecture that matches the product's primary task.
Never force every domain into the default "centered hero + 3 symmetric cards"
template.

---

## 1. SaaS Dashboard & Operational Workspace

*   **Structure**: Persistent compact left rail (`220px–248px`, collapsible on
    tablet/mobile) + restrained top context bar (`52px–56px` with breadcrumbs,
    date/filter controls, and 1 primary CTA) + asymmetric workspace canvas.
*   **Anti-Slop Rule**: Skip giant decorative greeting banners (`"Welcome back, Alex! 👋"`)
    and 4 bloated KPI cards with pastel icon circles. Put the primary analytical
    or operational view (sortable table, live chart, queue, or split inbox)
    above the fold.
*   **Metrics Strip Pattern**: Summarize 3–5 KPIs inside a single unified horizontal
    strip separated by vertical `1px` hairline dividers (`divide-x`), using
    `tabular-nums` and quiet muted deltas (`+4.2% vs prior 7d`).
*   **Table & List Craft**:
    *   Left-align text, right-align numbers/currency/dates (`tabular-nums`).
    *   Row height `44px–52px`; avoid heavy zebra striping—use subtle `1px`
        bottom hairlines and gentle row hover highlight.
    *   Show row actions cleanly on hover/focus or via an explicit `···` menu,
        not 4 bright buttons repeated on every row.

---

## 2. Marketing, Editorial & Product Landing Pages

*   **Hero Composition**: Prefer an **asymmetric split (7/5 or 6/6)**—sharp
    left-aligned headline (`text-wrap: balance`), concrete 1-sentence value prop,
    primary CTA + quiet secondary link, paired with a real interactive product
    preview, code snippet, or focused visual—OR an open typographic editorial
    opening with generous whitespace.
*   **Section Variety (Never Repeat 3-Column Card Grids Back-to-Back)**:
    *   *Feature Matrix*: A clean `1px` bordered CSS grid (`grid-cols-1 md:grid-cols-3`
        with `gap-px bg-[var(--border-subtle)]`) where cells sit flush on a
        structural grid with zero outer card shadows.
    *   *Interactive Showcase*: Tabbed or stepped split view where clicking a
        capability updates the live visual/code panel beside it.
    *   *Numbered Architecture / Workflow*: Horizontal or stacked `01 / 02 / 03`
        list separated by hairline rules.
    *   *Pricing / Plan Comparison*: Highlight the recommended tier via a crisp
        border and single primary CTA—not neon glow, confetti, or giant "MOST
        POPULAR" ribbons.
*   **Footer**: Compact, structured multi-column links + real copyright/status
    line; avoid bloated newsletter boxes with fake social proof.

---

## 3. Developer Tool, IDE, Docs & Technical Console

*   **Structure**: High-clarity, sharp radii (`4px–6px`), hairline `1px` borders,
    explicit panel boundaries, and monospace accents for IDs, endpoints, paths,
    durations, and keyboard shortcuts (`⌘K`, `Esc`).
*   **Hierarchy**: Prioritize scannability and speed. Replace multi-line prose
    descriptions with concise inline metadata (`200 OK · 42ms · us-east-1`).
*   **Log / Code / Diff Surfaces**: Give code and terminal blocks their own
    calibrated contrast surface with a quiet copy button and clean horizontal
    scroll (`overflow-x-auto`) that never breaks page width.

---

## 4. E-Commerce, Catalog & Marketplace

*   **Image-First Discipline**: Let product photography carry the visual weight
    in consistent aspect ratios (`aspect-[4/5]` or `aspect-square`, `object-cover`).
*   **Card Restraint**: Maximum 3–4 data points per product tile (Title, key
    variant/attribute, tabular price, optional subtle rating). Keep thumbnails
    clean—never stack 4 promotional badges over the image corners.
*   **Filtering & Sorting**: Sticky or collapsible filter rail on desktop,
    clean drawer/sheet on mobile, with active filter chips that can be cleared
    in one click.

---

## 5. Forms, Settings & Multi-Step Flows

*   **Reading & Input Width**: Constrain single-column forms to `max-w-xl` or
    `max-w-2xl` (`560px–672px`). Never stretch text inputs across a `1200px`
    screen.
*   **Grouping**: Group related settings under clear section headings with
    short practical descriptions (e.g., `"Webhook Secret"`, not `"Configure your
    amazing webhook settings"`). Separate sections with `1px` dividers and
    generous vertical space (`40px–48px`), not nested cards.
*   **Form Ergonomics**:
    *   Every input has a visible `<label>` (never placeholder-only labels).
    *   Validate inline on blur/submit with specific recovery text right below
        the field (`aria-describedby`).
    *   For long settings pages, surface a crisp sticky save bar only when
        changes are dirty, and isolate destructive actions (Delete / Revoke) in
        a separated danger block with explicit confirmation.

---

## 6. Compact, Mobile-First & Embedded UI (Including Inline Widgets)

*   **Progressive Disclosure**: Keep primary controls visible; tuck secondary
    parameters or raw exports behind clean tabs, segmented controls, or `<details>`.
*   **Touch & Pointer Ergonomics**: Interactive targets `>= 40px–44px` height on
    touch/mobile screens with `>= 8px` gap between adjacent buttons.
*   **Zero Nested Scroll Traps**: Avoid putting `overflow-y-auto` boxes inside
    other scrolling containers unless intentionally building a fixed-height split
    pane (like an IDE sidebar or data table).
*   **Fluid Reflow**: Use `grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr))`
    so layouts adapt cleanly at any container width without brittle breakpoint
    clipping.

---

## 7. Desktop Applications (Electron, Tauri, Qt, SwiftUI, WinUI)

*   **Workspace Grammar**: Use **Master-Detail** or **3-Pane Studio** layouts:
    collapsible source/navigation tree (`200px–260px`) + fluid primary canvas
    (`flex-1 min-w-0`) + contextual right inspector (`260px–320px`, shown only
    when an item is selected).
*   **Chrome & Toolbars**: Keep top toolbar compact (`36px–44px`), group
    related icon actions with thin vertical separators, and anchor a quiet
    `24px–28px` status bar along the bottom edge for background tasks, cursor
    coordinates, or connection state.
*   **Keyboard-First Power**: Expose a `⌘K / Ctrl+K` command palette for deep
    actions, support arrow-key selection in lists/trees, and display muted
    shortcut badges inside menus and tooltips.
*   **Window Discipline**: Respect OS titlebar/traffic-light/caption-button
    safe regions when using custom titlebars, and ensure panels reflow cleanly
    down to `~800px` window width without overlapping controls.

---

## 8. Mobile Applications (iOS, Android, React Native, Flutter)

*   **Thumb-Zone Architecture**: Place primary navigation (3–5 tabs max in a
    bottom tab bar) and the primary screen CTA within the bottom 40% of the
    screen. Reserve the top app bar for screen title, back navigation, and
    secondary search/overflow actions.
*   **Sheets Over Modals**: Use drag-dismissible **bottom sheets** for filters,
    pickers, and quick details instead of cramped centered web modals.
*   **Lists Over Dense Tables**: Present multi-attribute records as clean
    two-line list rows (Primary title + right-aligned `tabular-nums` value on
    line 1; muted subtitle + status chip on line 2) separated by subtle inset
    hairlines.
*   **Platform Respect**: Honor platform conventions (swipe-back gesture and
    clean header titles on iOS; top-level Material navigation/FAB discipline on
    Android) and reserve `SafeArea` padding at top and bottom edges.

---

## 9. Video Game Interfaces (HUDs, Menus, Inventories, Dialogue)

*   **In-Game HUD**:
    *   *Center-Screen Sacred*: Keep the middle 60% clear of static chrome.
        Place player vitals, minimap/compass, and ability/ammo clusters in
        consistent screen corners inside 5% safe-zone margins.
    *   *Contextual / Dynamic Fade*: Hide or dim non-critical HUD bars (e.g.,
        full stamina, empty quest tracker) outside combat or interaction.
    *   *Immediate Visual Read*: Pair numerical readouts (`tabular-nums`) with
        crisp segmented bars or cooldown radial/linear sweeps so state is clear
        in peripheral vision.
*   **Title, Pause & Settings Menus**:
    *   *Left-Aligned Stack Over Live World*: Anchor menu options in a clean
        vertical column on the left third (`25–35%` width) so the 3D scene,
        character, or key art breathes on the right. Avoid centered web hero
        cards.
    *   *Settings Ergonomics*: Group Video / Audio / Controls / Accessibility in
        clean horizontal tabs with real-time preview or description pane on the
        right, explicit `Apply / Reset to Defaults`, and an unsaved-changes prompt.
*   **Inventory, Crafting & Skill Trees**:
    *   *Grid/List + Dedicated Inspector*: Never render giant floating hover
        tooltips that cover adjacent inventory slots. Pair the item grid/list on
        the left with a fixed, spacious **Comparison & Stats Inspector** on the
        right showing item icon, tier/tag (icon + text, never color alone),
        equipped diff (`+12 DMG` green, `-4 DEF` red), and crisp action prompts.
    *   *Dual Input Parity*: Support both direct mouse click/drag and
        D-pad/WASD grid navigation with an unmistakable focus frame and a
        persistent bottom-edge **Control Legend Bar** (`[A / Enter] Equip  [X / R] Compare  [B / Esc] Close`).
*   **Dialogue & Narrative UI**:
    *   Use a lower-third scrim (`max-width: 65ch` text measure) with clear
        speaker nameplate, crisp `>= 22px` readable font, and numbered/hotkeyed
        response choices separated cleanly from spoken lines.

