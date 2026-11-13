# UI Design Craft — Mandatory Activation Rule

Whenever a task involves designing, building, styling, refactoring, prototyping,
or reviewing **any** user interface—across **Web**, **Desktop Apps**, **Mobile
Apps**, **Video Game UI/HUDs**, or **inline Generative UI artifacts**:

1. **Read the `ui-design-craft` skill (`SKILL.md`) first** before writing UI
   markup, styles, or component code (and read relevant `references/` files).
2. **Complete the Pre-Code Design Brief** in your reasoning/plan:
   - Target medium & 3-second primary user/player task.
   - One aesthetic thesis aligned with the domain.
   - Restrained 60-30-10 color plan with calibrated neutrals and **max 1 focal accent**.
   - Display-vs-body-vs-mono font pairing with verified imports and Turkish/Latin-Ext support.
   - Open, user-friendly split layout + bespoke inline `<svg>` visual anchor plan.
3. **Never ship AI slop**:
   - **Colors & Contrast**: No dark-slate (`#0f172a`) + purple/indigo/pink gradients,
     no murky tinted dark-green/brown backgrounds (`#141b18`, `bg-emerald-950`),
     no raw `#000000` / `bg-black` / `Colors.black` / `Color.black` surfaces
     (alpha scrims like `bg-black/70` excluded), no `bg-purple-500/20`-style
     neon translucent boxes, no `text-white` on bright yellow/amber/lime/cyan/emerald-400,
     and NEVER mix 3+ bright neon status/rarity colors on one screen.
   - **Icons & Graphics**: Write crisp, bespoke inline `<svg>` icons and
     domain silhouettes/illustrations (`currentColor`, `stroke-width: 1.5–1.75`;
     `aria-hidden="true"` when decorative, `aria-label` on icon-only buttons)
     instead of Unicode emojis (`✨`/`🚀`/`📦`/`🎉`/`💎`), `<Sparkles>`, or
     plain text-only boxes.
   - **Layout, Forms & Semantics**: No carditis (nested bordered boxes inside
     boxes), no duplicate redundant sections, no debug/QA state-simulator buttons
     in user headers, no `<div onClick>` / `<span onClick>` without native
     `<button type="button">` / `<a>` semantics, no `<img>` without `alt`, no
     placeholder-only inputs without `<label>` / `aria-label`, no unlabeled
     icon-only buttons, no flattened spatial groups (group cards/controls with
     `<section aria-labelledby>`, `<fieldset>`, and distinguishing item
     summaries), no nested-ternary JSX soup, and no medium mismatch (web pages
     in desktop apps, cramped tables on mobile, SaaS cards in games).
   - **Typography, Motion & Copy**: No unloaded webfonts (import via `<link>`,
     `@import`, `@fontsource`, or `next/font`), no display fonts on body copy,
     no `font-bold` everywhere (use `400/500/600` ladder), no `leading-none` /
     `line-height: 1` on headings or uppercase labels (keep `>= 1.12` / `>= 1.25`
     so `İ, Ş, Ğ` never clip), no `@keyframes` without `prefers-reduced-motion`,
     no buzzwords (*"Supercharge"*, *"Seamless"*, *"Acme Corp"*, *"Lorem ipsum"*),
     and always use `tabular-nums` on numbers.
4. **Verify before finishing**: Ensure all 5 UI states (default, loading, empty,
   error, overflow/`min-w-0`), end-to-end prompt acceptance criteria (zero
   quiet requirement drops / *specification satisficing*), keyboard/touch/gamepad
   focus parity (`outline-none` always paired with `focus-visible`), and
   platform checks pass; run `node skills/ui-design-craft/scripts/audit_ui_slop.mjs --strict`
   on modified UI source files.
