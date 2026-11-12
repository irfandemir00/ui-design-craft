# Anti-Slop Catalog: Pattern -> Fix

Use this catalog during both implementation and code review to spot and replace
characteristic AI-generated UI clichés.

---

## 1. Color, Surfaces & Effects

| AI Slop Pattern | Why It Looks Synthetic | Intentional Replacement |
| :--- | :--- | :--- |
| Dark slate (`#0f172a`) + purple/indigo/pink gradient (`#6366f1` -> `#ec4899`) | Instant hallmark of unprompted LLM templates | Pick an authentic palette: warm stone/paper (`#fafaf9`), crisp neutral zinc/neutral (`#fafafa`), deep charcoal (`#111214`), or domain-matched ink + **one** restrained accent |
| Gradient-clipped giant hero headline (`bg-clip-text text-transparent bg-gradient-to-r`) | Reduces legibility and reads like a 2022 crypto/AI clone | Solid high-contrast ink (`#111827` or `#f4f4f5`) with crisp weight/scale contrast; highlight at most 1–2 words via italic serif, underline, or subtle tint |
| Decorative blurred radial gradient blobs behind sections | Adds visual noise without hierarchy | Clean negative space, subtle 1px structural grid lines, or an actual product screenshot/interactive diagram |
| `backdrop-blur-md bg-white/10` on static cards | Muddy contrast and GPU cost when nothing moves underneath | Solid tonal surfaces separated by 1px hairline borders; reserve `backdrop-filter` strictly for sticky headers, floating command bars, or overlays passing over real scrolling content |
| Rainbow icon tiles (blue card, green card, purple card, amber card) | Arbitrary color noise destroys semantic meaning | Neutral monochrome icon treatments (`text-muted-foreground` on subtle neutral surface); reserve color strictly for status (success, warning, error) or active selection |
| Pulsing green/purple "Live" / "AI" dots on static labels | Fake urgency and visual jitter | Use status indicators only when backed by actual connection/job state |

---

## 2. Typography & Hierarchy

| AI Slop Pattern | Why It Looks Synthetic | Intentional Replacement |
| :--- | :--- | :--- |
| Uniform `Inter` + `font-semibold` everywhere (`h1`, `h2`, card titles, buttons) | Flat hierarchy; nothing leads the eye | Establish distinct weight & size steps: Display (`font-medium` or `font-semibold` with `-0.025em` tracking), section title, body (`400`), metadata (`12–13px` muted) |
| Tiny `text-xs uppercase tracking-widest` eyebrow above every single heading | Overused formulaic cadence | Use eyebrows sparingly only when categorizing genuinely distinct sections |
| Full-width prose paragraphs (`max-w-none` across 1200px) | Exhausting eye tracking (>90 characters per line) | Constrain readable prose to `55ch–68ch` (`max-w-prose`) |
| Unaligned numbers in tables, prices, KPIs, and timers | Digits jump horizontally when values differ | Always apply `font-variant-numeric: tabular-nums` (`tabular-nums` in Tailwind) |
| Clipped diacritics in Turkish / European uppercase (`Ş, Ğ, İ, Ö, Ü, Ç`) | Tight `leading-none` (`line-height: 1.0`) slices accents off top/bottom | Keep `line-height >= 1.12` on display headings and `>= 1.25` on uppercase labels |
| Orphans/widows in centered hero headlines | Awkward single-word last line | Apply `text-wrap: balance` on headings and `text-wrap: pretty` on body paragraphs |

---

## 3. Layout & "Carditis"

| AI Slop Pattern | Why It Looks Synthetic | Intentional Replacement |
| :--- | :--- | :--- |
| Centered hero + 3 identical feature cards + 3 pricing cards + FAQ | Every generated landing page shares the exact same skeleton | Vary layout rhythm: asymmetric 7/5 hero with live UI preview, bordered feature matrix (zero outer card shadows), horizontal step list, or split specification table |
| Boxes inside boxes inside boxes (`rounded-2xl` inside `rounded-2xl` inside `rounded-xl`) | Heavy visual borders suffocate content | Flatten nesting: let the page background be Layer 0, primary panels Layer 1, and separate internal groups with whitespace (`gap`) or `1px` hairline dividers |
| 4 identical KPI cards (`Total Revenue`, `Users`, `Conversion`, `Active`) at top of every dashboard | Signals generic boilerplate instead of real workflow priority | Put the primary workspace (table, chart, queue, editor) front and center; compact key metrics into a clean single-row summary bar or contextual header strip |
| Equal padding/gap everywhere (`p-6 gap-6` on all levels) | Violates Law of Proximity; user cannot tell which elements belong together | Use clear spacing ratios: tight intra-item gap (`4–8px`), medium sibling gap (`16–20px`), generous section separation (`48–80px`) |

---

## 4. Copywriting & Mock Data

| AI Slop Pattern | Why It Looks Synthetic | Intentional Replacement |
| :--- | :--- | :--- |
| *"Supercharge your workflow"*, *"Unlock the power of..."*, *"Seamless"*, *"Next-gen"*, *"Elevate"*, *"Effortless"* | Empty filler that says nothing concrete about what the product does | State the concrete mechanism and outcome: *"Query 50M log lines in under 200ms"*, *"Automated VAT reconciliation for multi-currency invoices"* |
| *"John Doe"*, *"Jane Smith"*, *"Acme Corp"*, *"test@example.com"* | Immediately exposes a synthetic mockup | Use realistic, culturally varied names, believable company names, and domain-accurate entities |
| Hyper-symmetrical mock numbers (`+12.5%`, `+20.1%`, `$45,231.89`, `1,234`) | Looks fabricated at a glance | Mix realistic magnitudes, negative deltas (`-3.4%`), zero/empty cases, unrounded decimals, and varied timestamps (`14m ago`, `Nov 9, 08:42`) |
| Explanatory filler subtitles under every obvious heading (`"Manage your team settings and preferences below"`) | Adds noise without helping the user | Omit self-evident subtitles; show useful metadata instead (e.g., `"4 active members · 1 pending invite"`) |

---

## 5. Icons, Badges & Imagery

| AI Slop Pattern | Why It Looks Synthetic | Intentional Replacement |
| :--- | :--- | :--- |
| `✨` / `🚀` / `⚡` / `📦` / `🛡️` Unicode emojis or empty text-only boxes | Looks amateurish and strips instant visual recognition | Author crisp, bespoke inline `<svg>` icons and domain silhouettes (items, navigation, empty states) with `currentColor` and consistent `stroke-width: 1.5–1.75` |
| Pill badges (`rounded-full px-2.5 py-0.5`) on every single tag, category, and metadata field | Badge soup makes real status alerts invisible | Render routine metadata as clean muted text separated by `·`; reserve pills for actionable filters or genuine status (`Failed`, `Pending Review`) |
| 48px gradient square holding a 20px stroke icon above 2 lines of text | Template filler | Align small `16px–20px` crisp icons inline with titles, or omit icons completely in typographic feature lists |

---

## 6. Motion & Micro-Interactions

| AI Slop Pattern | Why It Looks Synthetic | Intentional Replacement |
| :--- | :--- | :--- |
| `hover:scale-105` or `hover:-translate-y-1` on large informational cards | Causes layout jitter and feels like a toy | Subtle border-color shift (`border-neutral-300`), gentle surface highlight, or reveal of an explicit action cue |
| `duration-500` or `duration-700` on dropdowns, tabs, and tooltips | Makes the product feel sluggish | Keep UI feedback crisp: `100ms–160ms` for hover/press/focus, `180ms–260ms` for drawers/modals with `cubic-bezier(0.2, 0, 0, 1)` |
| Continuous bouncing/floating idle animations on illustrations or CTAs | Distracting and fatiguing | Zero idle motion on static chrome; respect `@media (prefers-reduced-motion: reduce)` everywhere |

---

## 7. Engineering & Layout Bugs Common in AI UI

*   **Missing `min-w-0` on flex/grid children**: Long titles or URLs blow out card widths or trigger horizontal page scroll. Always add `min-w-0` on flex/grid containers holding `truncate` text.
*   **`<div onClick={...}>` instead of `<button>`**: Breaks keyboard navigation (`Tab`/`Enter`/`Space`) and screen readers. Always use native `<button type="button">`, `<a>`, or `<input>`.
*   **Hidden focus states (`outline-none` without replacement)**: Always pair `focus:outline-none` with a clear `focus-visible:ring-2 focus-visible:ring-offset-2` ring.
*   **Over-eager sticky/fixed headers without scroll padding**: Overlapping anchors or eating 25% of mobile viewport height. Keep mobile headers compact (`52–56px`) and set `scroll-margin-top`.

---

## 8. Desktop Application AI Slop (Electron, Tauri, Qt, SwiftUI, WinUI)

| AI Slop Pattern | Why It Looks Synthetic | Intentional Replacement |
| :--- | :--- | :--- |
| Website hero banner, huge `p-8` cards, and `max-w-7xl mx-auto` centered container inside a desktop app | Feels like an embedded SaaS landing page, wastes screen real estate | Use edge-to-edge split panes, persistent compact sidebar/inspector rails, and dense `28px–36px` toolbars |
| Missing keyboard shortcuts, command palette, or `Esc` behavior | Power users expect instant keyboard flow in desktop tools | Support `Ctrl/Cmd+K`, arrow-key list traversal, `Enter`/`Esc` commit/cancel, and show muted keycap hints (`⌘S`) |
| Fixed pixel panel widths with no resize/collapse support | Breaks on laptop screens (`1280×720`) or ultrawide monitors | Implement draggable splitters or fluid panels with sensible `min-width` / `max-width` bounds |
| Custom garish browser scrollbars or text selection enabled on UI chrome | Betrays a raw HTML wrapper immediately | Use `user-select: none` on buttons/tabs/toolbars (keep selectable on logs/code/inputs) and subtle native-matched scrollbars |
| Missing window status bar or feedback on background jobs | Desktop apps feel disconnected from local system state | Include a crisp `24px–28px` status strip or subtle inline job progress indicator (`Indexed 1,420 files · 18ms`) |

---

## 9. Mobile Application AI Slop (iOS, Android, React Native, Flutter)

| AI Slop Pattern | Why It Looks Synthetic | Intentional Replacement |
| :--- | :--- | :--- |
| Multi-column desktop data table or 3-column grid forced onto a `390px` phone | Triggers horizontal scrolling or unreadable 2-word wrapped columns | Transform tables into clean scannable list rows (Title + primary metric on row 1, muted metadata on row 2) |
| Primary CTA placed at the top-right corner or tiny `32px` icon buttons | Violates one-handed thumb-zone ergonomics and causes mis-taps | Anchor primary actions and navigation in the bottom 40% (`>= 44pt / 48dp` hit target with `>= 8px` spacing) |
| Content colliding with notch, Dynamic Island, status bar, or home indicator | Looks unpolished and broken on real devices | Enforce `SafeArea` / `WindowInsets` / `env(safe-area-inset-*)` on headers, drawers, and bottom bars |
| Web-style center popups for quick pickers, filters, or confirmations | Feels foreign on mobile | Use native-feeling bottom sheets with drag handle, segmented controls, or inline expansion |
| Hover-dependent tooltips or hidden delete/edit icons | Touch screens have no hover state | Expose primary actions directly, use swipe-to-reveal with visible fallback menu, or tap-to-expand |

---

## 10. Video Game UI AI Slop (HUDs, Menus, Inventories, Dialogue)

| AI Slop Pattern | Why It Looks Synthetic | Intentional Replacement |
| :--- | :--- | :--- |
| Generic white/dark-slate Tailwind `rounded-2xl` SaaS cards (`Inter` font, pill badges) inside a fantasy/sci-fi/action game | Destroys immersion immediately; looks like a web admin panel pasted over gameplay | Craft world-matched framing (sharp chamfered corners, weathered parchment/ink, pixel bevels, diegetic gauges, or clean tactical hairlines) |
| Unreadable HUD text floating directly over bright snow, fire, or sky without scrim/outline | Player cannot read ammo, HP, or subtitles during action | Protect HUD typography and bars with dark backing scrims (`rgba(10,12,15,0.72)`), crisp `1px` edge contrast, or subtle dark outline/shadow |
| All 12 HUD widgets permanently visible around all 4 screen edges | Visual claustrophobia; steals focus from gameplay | Keep center screen sacred; group related stats cleanly in corners and auto-fade out-of-combat bars when full/idle |
| Tiny `11px–13px` lore/inventory text and dense multi-paragraph tooltips | Completely illegible on TVs (10-foot distance) and handhelds (Steam Deck) | Scale body text (`>= 18–22px` equiv. at 1080p, `>= 26–28px` for 10-foot/handheld mode) and split stats cleanly from flavor text |
| Mouse-only hover states and tiny `X` close buttons | Breaks completely with a controller or keyboard D-pad | Design explicit high-contrast focus/selection rings, wrap-around grid/list navigation, and a dynamic footer input legend (`[A] Equip  [B] Back  [X] Compare`) |
| Rarity or team status indicated by color alone, OR 4–5 screaming neon hues (`#4ade80` + `#38bdf8` + `#fb7185` + `#e09f3e`) fighting on a murky green-black canvas | Colorblind failure or neon rainbow visual chaos | Use clean low-chroma obsidian/charcoal neutrals (`#0E1013`–`#1D2128`), ONE primary accent, and restrained tonal badges paired with distinct `<svg>` shapes |
| Text-only inventory rectangles without item artwork or silhouettes | Feels like an Excel sheet instead of a game | Draw bespoke inline `<svg>` weapon, armor, and module silhouettes in every slot and enlarged in the inspector |
| QA/debug state toggles (`[Normal] [Loading] [Error]`) or duplicate stacked grids in user-facing UI | Confuses real players and creates 20+ nested boxes | Keep user chrome 100% dedicated to the player task; separate active loadout and storage cleanly in an open split layout |

