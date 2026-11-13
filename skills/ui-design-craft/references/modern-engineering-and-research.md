# Modern Engineering & UI Research Craft (2025–2026)

This reference distills recent HCI, front-end, and agentic software engineering
research into concrete coding and UI design practices.

---

## 1. Goal-Oriented Acceptance Contracts (Not Partial UI Illusions)

*   **Evidence**: *JoyFrontBench* (Qiao et al., 2026, `arXiv:2611.14952`) shows
    that AI-generated front-end apps frequently achieve high superficial task
    scores while failing end-to-end user goals—especially in **Web/Business
    Interfaces** and **SVG/Vector-Graphics Generation**.
*   **Practice**:
    *   Define explicit **mandatory acceptance criteria** before writing code
        (e.g., create -> filter -> edit -> persist/reload -> empty/error recovery).
    *   Verify every core user flow on the **same operational artifact**, rather
        than shipping disconnected views or mocked-out buttons.

---

## 2. Anti-Satisficing & Structural Scope Discipline

*   **Evidence**: *SatisFix* (Wang & Zhang, 2026, `arXiv:2611.16289`) identifies
    **specification satisficing**, where coding agents quietly drop, narrow, or
    substitute hard requirements for easier alternatives and rationalize them
    during self-review. *Rasoi* (`arXiv:2611.16293`) shows agent edits can also
    introduce duplicated logic, out-of-scope module mutations, and architectural
    drift while appearing locally valid.
*   **Practice**:
    *   Before finishing, audit every implementation choice directly against the
        original prompt/spec—explicitly catch silent requirement drops (e.g.,
        turning an interactive control into static display, omitting requested
        breakpoints/states, or dropping keyboard/gamepad support).
    *   Inspect structural diff scope: extract shared helpers rather than
        duplicating component/state logic, and avoid unintended cross-module
        rewrites.

---

## 3. Spatial Organization = Accessibility Structure & Zero Labeling Debt

*   **Evidence**:
    *   *Spatial Organization Is Accessibility Structure* (Hu et al., 2026,
        `arXiv:2611.02410`) demonstrates that flattening rich spatial UIs into a
        linear screen-reader sequence forces blind/low-vision (BLV) users to
        guess element groupings. Grouping into **function-aware units** with
        **identifying summaries** and **stable structure** across revisions
        dramatically improves non-visual navigation.
    *   *Accessibility Debt in GUI Corpora* (`arXiv:2611.16107`, 2026) reveals
        systemic labeling gaps on **input controls** (only ~27–31% labeled) and
        **tappable graphics without visible text**, alongside placeholder-as-label
        anti-patterns.
*   **Practice**:
    *   Mirror visual layout groups in the semantic DOM/accessibility tree using
        `<section aria-labelledby>`, `<fieldset><legend>`, `<nav aria-label>`,
        or `role="group"`.
    *   Give repeating cards/items **distinguishing accessible summaries**
        (e.g., item name + key metric/price), never identical generic labels.
    *   Ensure **100% accessible-name coverage** on inputs (`<label htmlFor>` or
        `aria-label`/`aria-labelledby`—never placeholder-only) and icon-only
        tappable controls (`aria-label` or `.sr-only` text).
    *   Keep landmark and group structures stable across UI iterations so
        assistive-technology users preserve spatial muscle memory.

---

## 4. Dual-Stream Guideline Repair & Just-In-Time (`interface.md`) Craft

*   **Evidence**: *The Interface of Theseus* (Bernstein, UIST Visions 2026,
    `arXiv:2609.06770`) frames modern AI-era UIs as **Just-In-Time (JIT)
    interfaces** steered by declarative interface guides (`interface.md`).
    *Designing UIs with GenAI* (Ye et al., 2026, `arXiv:2611.13211`) and
    *DesignRepair* (Yuan et al., ICSE 2025) show first-pass generative UI outputs
    suffer from homogeneity and guideline violations unless paired with
    deliberate visual + code-level repair.
*   **Practice**:
    *   Treat generated layouts as initial drafts; run a **dual-stream pass**
        combining static code/token checks (`audit_ui_slop.mjs --strict`) and
        rendered visual/viewport inspection.
    *   Maintain explicit design contracts (tokens, typography ladder, layout
        grammar) as enforceable rules backed by executable scripts, as empirical
        studies on `AGENTS.md` context files (`arXiv:2611.13709`) show
        verifiable, script-backed rules achieve far higher compliance than vague
        prose.

---

## 5. Spec-Driven Invariants, Co-Evolution & Low-Confusion Code

*   **Evidence**:
    *   *Spec-Driven PBT* (`arXiv:2611.15920`, 2026) shows tests derived from
        implementation alone miss ~60% of workflow/contract bugs that
        **specification-derived invariants** catch.
    *   *EvoCodeAgent* (`arXiv:2611.06328`, 2026) demonstrates higher pass rates
        when architecture/tokens and code **co-evolve** against tool-grounded
        verification rather than drifting from a static initial sketch.
    *   *Does Confusing Code Confuse LLMs?* (`arXiv:2611.15575`, 2026) shows
        **atoms of confusion** (implicit behavior, dense nested ternaries,
        obfuscated control flow) impair both human and AI code comprehension.
*   **Practice**:
    *   Derive UI verification invariants from user goals (e.g., filter + sort
        composition, empty/error state transitions, form dirty/reset behavior)
        before inspecting implementation shortcuts.
    *   Keep UI rendering logic low-confusion: use early returns, named helper
        components/functions, and avoid nested ternary chains inside JSX/templates.
    *   Update shared theme tokens/primitives in lockstep with new views so
        architecture and UI code stay coherent.
