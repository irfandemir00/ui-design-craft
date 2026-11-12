# States, Accessibility & Visual Verification

Real product interfaces are defined by how they behave under imperfect
conditions—empty data, slow requests, long strings, keyboard navigation, and
narrow screens.

---

## 1. The 5 Mandatory UI States

Never deliver a "happy-path-only" view. Every data-driven or interactive region
must handle:

1.  **Default / Populated**:
    *   Action hierarchy: **1 primary action** per region/dialog; secondary
        actions use outline/ghost styling; destructive actions require explicit
        confirmation.
    *   Include realistic data variance (short and long names, mixed statuses,
        negative and zero values).
2.  **Loading / Pending**:
    *   Match skeleton dimensions to the real layout so content does not jump
        when data resolves.
    *   Disable or show inline spinner inside submitting buttons to prevent
        double-clicks, preserving button width so layout does not jitter.
3.  **Empty State**:
    *   Explain *why* it is empty (zero records vs. active search filter returning
        no matches) and offer **one** direct next step (`Create First Rule` or
        `Clear Filters`).
    *   Keep visuals restrained (clean muted icon or hairline illustration)—no
        oversized cartoonish hero graphics.
4.  **Error State**:
    *   State what failed in plain language and provide an actionable retry or
        fallback (`Retry Request`), never exposing raw stack traces to end
        users and never wiping unsaved form input.
5.  **Overflow & Edge-Case Content**:
    *   Apply `min-w-0` on flex/grid parents alongside `truncate` or
        `line-clamp-2` on dynamic titles, emails, and file paths.
    *   Use `overflow-wrap: anywhere` for unbroken tokens (hashes, URLs, API
        keys).

---

## 2. Accessibility & Interaction Baseline

*   **Semantic Elements**: Use `<button type="button">` for actions, `<a href>`
    for navigation, `<main>`, `<nav>`, `<header>`, and real `<h1>–<h4>` heading
    levels in strict descending order without skipping levels.
*   **Contrast (WCAG AA)**:
    *   Body & UI text: `>= 4.5:1` against its actual background surface.
    *   Large display text (`>= 24px` or `>= 18.6px bold`), borders of active
        inputs, and meaningful icons: `>= 3.0:1`.
    *   Avoid low-contrast placeholder text (`#a1a1aa` on `#ffffff` fails AA if
        used for readable body/labels).
*   **Keyboard & Focus**:
    *   Every interactive element is reachable via `Tab` and clearly styled with
        `:focus-visible` (e.g., `2px` outline/ring with `2px` offset). Never
        use `outline: none` without a visible `:focus-visible` replacement.
    *   Modals/drawers trap focus cleanly, close on `Escape`, and restore focus
        to the trigger element on close.
    *   Custom icon-only buttons always carry an explicit `aria-label`.
*   **Motion Restraint**:
    *   Keep transitions fast (`120ms–200ms`) with `cubic-bezier(0.2, 0, 0, 1)`.
    *   Always include:
        ```css
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        ```

---

## 3. Verification Protocol (Code + Visual)

Before concluding any UI task, execute both layers of verification:

### A. Static Code & Copy Audit

*   Confirm zero AI-slop relics (`✨`, `🚀`, `Sparkles`, *"Supercharge"*,
    *"Seamless"*, *"Acme Corp"*, *"John Doe"*, unprompted purple/indigo gradients).
*   Confirm all numeric columns, prices, percentages, and dates include
    `tabular-nums`.
*   Confirm flex/grid truncation uses `min-w-0` and buttons/inputs are semantic
    HTML with `:focus-visible` styles.
*   Confirm typecheck/build/lint passes in the project if a build toolchain exists.

### B. Live Rendered Inspection (For Web Apps & HTML Pages)

When running a local dev server or opening an HTML page in a browser (via the
browser subagent or Chrome DevTools MCP):

1.  **Desktop Pass (`1280x800` or `1440x900`)**:
    *   Verify visual hierarchy in the first 3 seconds: clear focal point,
        balanced spacing, crisp borders, and legible muted vs. primary ink.
    *   Check console for runtime errors, failed font/asset requests, or layout
        warnings.
2.  **Mobile Pass (`375x812`)**:
    *   Verify zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`).
    *   Check that navigation collapses cleanly, tables scroll or stack cleanly,
        and touch targets have comfortable spacing.
3.  **Interactive State Pass**:
    *   Trigger primary interactive paths (tabs, filters, modals, form validation,
        empty state) and verify `Tab` focus visibility across controls.

### C. Platform-Specific Verification (Desktop, Mobile & Video Games)

*   **Desktop Application Checks**:
    *   Test minimum usable window size (`~800×600`) and wide monitor (`1920+`)
        for pane overlap, clipped toolbars, and splitter limits.
    *   Verify keyboard-only workflow (`Tab`, arrow keys in lists/trees,
        `Ctrl/Cmd+K`, `Escape`) and verify OS light/dark theme alignment.
*   **Mobile Application Checks**:
    *   Verify `SafeArea` / notch / home-indicator clearance on both small
        (`360–375px`) and large (`430px`) viewports.
    *   Confirm every tappable control is `>= 44×44pt / 48×48dp` with no
        accidental overlap and that soft-keyboard appearance keeps active
        inputs and submit buttons accessible.
*   **Video Game UI Checks**:
    *   **Backdrop Contrast Stress-Test**: Inspect HUD and dialogue legibility
        against bright white, high-saturation, and near-black scenes—confirm
        scrims/outlines keep text crisp in every case.
    *   **Aspect Ratio & Scaling**: Check `16:9` (`1920×1080`), handheld
        `16:10` (`1280×800`), and `21:9` ultrawide (HUD anchored inside 5%
        safe-zone or centered 16:9 bounds without stretching).
    *   **Controller / Keyboard-Only Traversal**: Navigate every menu, tab,
        inventory slot, and modal purely with D-pad/arrow keys + Confirm/Back—
        confirm zero dead-end focus traps and unmistakable active selection.
    *   **Colorblind & Subtitle Readability**: Confirm rarity/team/status cues
        never rely on hue alone, and verify subtitle/lore legibility at
        10-foot viewing distance.
