import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { auditFile } from "../skills/ui-design-craft/scripts/audit_ui_slop.mjs";

function withTempFile(filename, content, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ui-craft-test-"));
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content, "utf8");
  try {
    return fn(filePath, dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test("catches multi-line JSX non-semantic click, gradient text, and missing focus ring", () => {
  const jsx = `
export function BadCard() {
  return (
    <div
      className="p-4 cursor-pointer"
      onClick={(e) => {
        if (e.detail > 0) console.log("clicked");
      }}
    >
      <h1 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500">
        Hello
      </h1>
      <button
        type="button"
        className="outline-none px-4 py-2 bg-amber-400 text-white"
      >
        Save
      </button>
    </div>
  );
}
`;
  const res = withTempFile("BadCard.tsx", jsx, (file) => auditFile(file));
  const errorRules = res.errors.map((e) => e.rule);
  assert.ok(errorRules.includes("non-semantic-click"));
  assert.ok(errorRules.includes("gradient-text-slop"));
  assert.ok(errorRules.includes("missing-focus-ring"));
  assert.ok(errorRules.includes("low-contrast-accent-text"));
});

test("does not false-positive when multi-line JSX has proper focus-visible, type, alt, and role", () => {
  const jsx = `
export function GoodPanel() {
  return (
    <section className="bg-[#0D0F12] text-[#F1F3F5] p-6">
      <div
        role="button"
        tabIndex={0}
        onClick={() => {}}
        className="cursor-pointer"
      >
        <img
          src="/preview.png"
          alt="Dashboard preview"
        />
      </div>
      <button
        type="button"
        className="outline-none focus-visible:ring-2 bg-[#1D4ED8] text-white px-4 py-2"
      >
        Continue
      </button>
    </section>
  );
}
`;
  const res = withTempFile("GoodPanel.tsx", jsx, (file) => auditFile(file));
  assert.equal(res.errors.length, 0);
  assert.equal(res.warnings.length, 0);
});

test("catches diacritic leading-none clip, murky dark green bg, and Tailwind neon rainbow soup", () => {
  const jsx = `
export function TurkishSlop() {
  return (
    <main className="bg-[#141b18] p-6">
      <h1 className="text-3xl leading-none uppercase">Şirket Özeti</h1>
      <span className="text-green-400">OK</span>
      <span className="text-sky-400">Sync</span>
      <span className="text-rose-400">Alert</span>
      <span className="text-amber-400">Warn</span>
      <img src="/logo.png" />
      <button>Submit</button>
    </main>
  );
}
`;
  const res = withTempFile("TurkishSlop.tsx", jsx, (file) => auditFile(file));
  const warnRules = res.warnings.map((w) => w.rule);
  assert.ok(warnRules.includes("murky-tinted-dark-bg"));
  assert.ok(warnRules.includes("diacritic-leading-clip"));
  assert.ok(warnRules.includes("neon-rainbow-soup"));
  assert.ok(warnRules.includes("img-missing-alt"));
  assert.ok(warnRules.includes("button-missing-type"));
});

test("allows bg-black/70 scrims and fallback Arial after curated font, flags solid bg-black and primary Arial", () => {
  const css = `
.overlay { background: rgba(0, 0, 0, 0.7); }
.good-font { font-family: "Plus Jakarta Sans", Arial, sans-serif; }
.bad-font { font-family: Arial, sans-serif; }
.bad-bg { background-color: #000000; }
.bad-grad { background-image: linear-gradient(135deg, #0f172a, #6366f1); }
`;
  const res = withTempFile("styles.css", css, (file) => auditFile(file));
  const warnRules = res.warnings.map((w) => w.rule);
  const errorRules = res.errors.map((e) => e.rule);
  assert.equal(warnRules.filter((r) => r === "generic-font-slop").length, 1);
  assert.equal(warnRules.filter((r) => r === "pure-black-background").length, 1);
  assert.ok(errorRules.includes("ai-gradient-slop"));
});

test("checks native/game UI rules and .uicraftrc.json config + CLI --json / --strict", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ui-craft-cli-"));
  try {
    const ussPath = path.join(dir, "hud.uss");
    fs.writeFileSync(ussPath, ".label { font-size: 11px; }", "utf8");

    const dartPath = path.join(dir, "screen.dart");
    fs.writeFileSync(dartPath, "Container(color: Colors.black)", "utf8");

    const rcPath = path.join(dir, ".uicraftrc.json");
    fs.writeFileSync(
      rcPath,
      JSON.stringify({ disabledRules: ["tiny-game-ui-text"] }),
      "utf8"
    );

    const scriptPath = path.resolve(
      "skills/ui-design-craft/scripts/audit_ui_slop.mjs"
    );
    const out = execFileSync(
      process.execPath,
      [scriptPath, "--json", ussPath, dartPath],
      { encoding: "utf8" }
    );
    const parsed = JSON.parse(out);
    assert.equal(parsed.filesChecked, 2);
    assert.equal(parsed.errorCount, 0);
    assert.equal(parsed.warningCount, 1);
    assert.equal(parsed.warnings[0].rule, "pure-black-background");

    assert.throws(() => {
      execFileSync(
        process.execPath,
        [scriptPath, "--strict", dartPath],
        { encoding: "utf8" }
      );
    });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("catches placeholder-only input, unlabeled icon button, and nested ternary confusion without false positives", () => {
  const badJsx = `
export function FormAndIcons({ a, b }) {
  const label = a ? "x" : b ? "y" : "z";
  return (
    <form>
      <input type="text" placeholder="Search orders..." />
      <button type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
      </button>
    </form>
  );
}
`;
  const badRes = withTempFile("BadForm.tsx", badJsx, (file) => auditFile(file));
  const warnRules = badRes.warnings.map((w) => w.rule);
  assert.ok(warnRules.includes("placeholder-only-input"));
  assert.ok(warnRules.includes("icon-button-missing-label"));
  assert.ok(warnRules.includes("confusing-nested-ternary"));

  const goodJsx = `
export function AccessibleForm({ url = "https://example.com?a=1&b=2" }) {
  return (
    <form>
      <label htmlFor="q">Search</label>
      <input id="q" type="text" placeholder="Search orders..." data-url={url} />
      <button type="button" aria-label="Close panel">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12" /></svg>
      </button>
    </form>
  );
}
`;
  const goodRes = withTempFile("GoodForm.tsx", goodJsx, (file) => auditFile(file));
  assert.equal(goodRes.errors.length, 0);
  assert.equal(goodRes.warnings.length, 0);
});
