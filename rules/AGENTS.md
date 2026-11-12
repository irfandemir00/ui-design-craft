# UI Design Craft — Mandatory Activation Rule

Whenever a task involves designing, building, styling, refactoring, prototyping,
or reviewing **any** user interface—across **Web**, **Desktop Apps**, **Mobile
Apps**, **Video Game UI/HUDs**, or **inline Generative UI artifacts**:

1. **Read the `ui-design-craft` skill (`SKILL.md`) first** before writing UI
   markup, styles, or component code (and read relevant `references/` files).
2. **Complete the Pre-Code Design Brief** in your reasoning/plan (medium,
   user/player task, one aesthetic thesis, restrained 60-30-10 color plan with
   max 1 focal accent, display-vs-body font pairing with verified imports, and
   open user-friendly layout).
3. **Never ship AI slop**:
   - **Colors**: No dark-slate + purple/indigo gradients, no murky tinted
     dark-green/brown backgrounds, no raw `#000000`, no `text-white` on bright
     yellow/amber/lime/cyan, and NEVER mix 3+ bright neon status/rarity colors
     on one screen.
   - **Icons & Graphics**: Write crisp, bespoke inline `<svg>` icons and
     domain silhouettes/illustrations (`currentColor`, `stroke-width: 1.5–1.75`)
     instead of Unicode emojis (`✨`/`🚀`/`📦`), icon-font crutches, or plain
     text-only boxes.
   - **Layout & UX**: No carditis (nested bordered boxes inside boxes), no
     duplicate redundant sections, no debug/QA state-simulator buttons in user
     headers, and no medium mismatch (web pages in desktop apps, cramped tables
     on mobile, SaaS cards in games).
   - **Typography & Copy**: No unloaded webfonts, no display fonts on body
     copy, no buzzwords (*"Supercharge"*, *"Seamless"*, *"Acme Corp"*), and
     always use `tabular-nums` on numbers.
4. **Verify before finishing**: Ensure all 5 UI states, keyboard/touch/gamepad
   focus parity, and overflow/contrast checks pass; run `audit_ui_slop.mjs` on
   modified UI source files.
