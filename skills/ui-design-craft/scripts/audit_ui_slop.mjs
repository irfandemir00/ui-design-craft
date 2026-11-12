#!/usr/bin/env node
/**
 * Anti-AI-Slop UI Auditor (Web, Desktop, Mobile, Video Game UI)
 * Zero-dependency Node script usable from CLI or imported by hooks.
 *
 * Usage:
 *   node audit_ui_slop.mjs <file-or-dir> [...]
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const WEB_MARKUP_EXTS = new Set([
  ".html",
  ".htm",
  ".jsx",
  ".tsx",
  ".vue",
  ".svelte",
  ".astro",
]);

const STYLE_EXTS = new Set([".css", ".scss", ".sass", ".less", ".uss"]);

const UI_EXTS = new Set([
  ...WEB_MARKUP_EXTS,
  ...STYLE_EXTS,
  ".qml",
  ".uxml",
  ".xaml",
  ".dart",
  ".swift",
  ".kt",
]);

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".nuxt",
  ".svelte-kit",
  "target",
  "Library",
  "Temp",
  ".venv",
  "venv",
  "__pycache__",
]);

export function isUiFile(filePath) {
  return UI_EXTS.has(path.extname(filePath).toLowerCase());
}

function isIgnoredLine(line) {
  return line.includes("ui-craft-ignore");
}

/**
 * Audit a single UI source file and return { errors: Finding[], warnings: Finding[] }.
 */
export function auditFile(filePath) {
  const errors = [];
  const warnings = [];

  if (!isUiFile(filePath) || !fs.existsSync(filePath)) {
    return { errors, warnings };
  }

  const stat = fs.statSync(filePath);
  if (!stat.isFile() || stat.size > 1024 * 1024) {
    return { errors, warnings };
  }

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const ext = path.extname(filePath).toLowerCase();
  const isWebOrStyle = WEB_MARKUP_EXTS.has(ext) || STYLE_EXTS.has(ext);
  const isWebMarkup = WEB_MARKUP_EXTS.has(ext);

  const push = (list, lineNum, rule, message) => {
    list.push({ file: filePath, line: lineNum, rule, message });
  };

  // Line-by-line high-confidence checks
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    if (isIgnoredLine(line)) return;

    // 1. Emoji icon crutches instead of bespoke inline SVGs
    if (/[✨🚀⚡🔥🎯💡📦🛡⚔📊]/.test(line) || /<\s*Sparkles(?:Icon)?\b/.test(line)) {
      push(
        errors,
        lineNum,
        "emoji-slop",
        "Avoid emoji icon crutches (✨/🚀/⚡/📦/🛡️/etc.) or <Sparkles>; write bespoke inline <svg> icons or clean plain text."
      );
    }

    // 2. Banned AI placeholder copy & toy data
    const buzzMatch = line.match(
      /\b(Supercharge your|Unlock the power of|Elevate your workflow|Next-gen platform|Seamless experience|Acme Corp|John Doe|Jane Doe|Jane Smith)\b/i
    );
    if (buzzMatch) {
      push(
        errors,
        lineNum,
        "buzzword-copy",
        `Replace generic AI placeholder copy ("${buzzMatch[0]}") with concrete, domain-authentic copy or varied mock data.`
      );
    }

    if (isWebOrStyle) {
      // 3. Gradient-clipped giant hero text
      if (/bg-clip-text/.test(line) && /text-transparent/.test(line)) {
        push(
          errors,
          lineNum,
          "gradient-text-slop",
          "Avoid bg-clip-text text-transparent hero gradient text; use high-contrast solid ink with deliberate weight/scale hierarchy."
        );
      }

      // 4. Card wobble hover scale
      if (/\bhover:scale-(105|110)\b/.test(line)) {
        push(
          errors,
          lineNum,
          "card-wobble",
          "Avoid hover:scale-105/110 wobble on containers; use crisp 120-180ms border, surface, or opacity shifts."
        );
      }

      // 5. Missing focus replacement for outline-none
      if (
        (/\boutline-none\b/.test(line) || /outline\s*:\s*none\b/.test(line)) &&
        !/focus-visible:|focus:ring|:focus-visible/.test(line)
      ) {
        push(
          errors,
          lineNum,
          "missing-focus-ring",
          "outline-none without a visible focus-visible ring breaks keyboard navigation; pair with focus-visible:ring-2."
        );
      }

      // 6. White text on bright accent backgrounds (WCAG contrast failure)
      if (
        /\btext-white\b/.test(line) &&
        /\bbg-(yellow|amber|lime)-[345]00\b|\bbg-(cyan|emerald|green)-[34]00\b/.test(
          line
        )
      ) {
        push(
          errors,
          lineNum,
          "low-contrast-accent-text",
          "text-white on bright yellow/amber/lime/cyan/emerald-400 fails WCAG contrast; use dark ink (text-neutral-950) or darken the accent surface."
        );
      }

      // 7. Muddy neon translucent boxes
      if (
        /\bbg-(indigo|purple|violet|pink)-[45]00\/(10|15|20|25)\b/.test(line) &&
        /\bborder-(indigo|purple|violet|pink)-[45]00\//.test(line)
      ) {
        push(
          errors,
          lineNum,
          "neon-translucent-slop",
          "Avoid muddy neon translucent boxes (bg-purple-500/20 border-purple-500/...); use tonal neutral surfaces with 1px hairline borders."
        );
      }

      // 8. Legacy unstyled default fonts
      if (
        /font-family\s*:[^;]*(Arial|Helvetica Neue|Times New Roman|Comic Sans)/i.test(
          line
        )
      ) {
        push(
          warnings,
          lineNum,
          "generic-font-slop",
          "Avoid generic Arial/Times/Comic Sans declarations; pick a curated domain font pairing or clean OS system UI stack."
        );
      }

      // 9. Raw #000000 background (non-scrim)
      if (
        (/\bbg-\[#000(?:000)?\]\b/i.test(line) ||
          /background(?:-color)?\s*:\s*#000(?:000)?\s*;/i.test(line))
      ) {
        push(
          warnings,
          lineNum,
          "pure-black-background",
          "Avoid raw #000000 backgrounds; use calibrated deep charcoal/obsidian (#0B0D10–#141619) matched to your undertone."
        );
      }
    }

    if (isWebMarkup) {
      // 6. Non-semantic <div onClick> / <span onClick>
      if (
        /<\s*(div|span)\b[^>]*\bonClick\s*=/.test(line) &&
        !/\brole\s*=/.test(line)
      ) {
        push(
          errors,
          lineNum,
          "non-semantic-click",
          "Use native <button type=\"button\"> or <a> instead of clickable <div>/<span> without role/keyboard support."
        );
      }
    }
  });

  // File-level pattern checks
  if (isWebOrStyle && !content.includes("ui-craft-ignore-file")) {
    const hasDarkSlate =
      /\bbg-slate-9[05]0\b|#0f172a\b/i.test(content);
    const hasPurpleIndigoGrad =
      /\b(from|via|to)-(indigo|purple|violet|pink)-[456]00\b|#6366f1\b|#8b5cf6\b/i.test(
        content
      );
    if (hasDarkSlate && hasPurpleIndigoGrad) {
      push(
        errors,
        1,
        "ai-gradient-slop",
        "Detected dark-slate + indigo/purple/pink gradient cliché. Switch to a calibrated 60-30-10 domain palette with a single intentional accent."
      );
    }

    if (
      isWebMarkup &&
      /\btruncate\b/.test(content) &&
      /\b(flex|grid)\b/.test(content) &&
      !/\bmin-w-0\b/.test(content)
    ) {
      push(
        warnings,
        1,
        "truncate-without-min-w-0",
        "Uses 'truncate' inside flex/grid without 'min-w-0'; long strings may blow out container width."
      );
    }

    if (
      isWebMarkup &&
      /(\$[0-9]|tabular|KPI|Revenue|Balance|Score|HP|Ammo)/i.test(content) &&
      /\btext-(2xl|3xl|4xl)\b/.test(content) &&
      !/\btabular-nums\b|font-variant-numeric\s*:\s*tabular-nums/.test(content)
    ) {
      push(
        warnings,
        1,
        "missing-tabular-nums",
        "Large metrics/numbers detected without 'tabular-nums' (font-variant-numeric: tabular-nums)."
      );
    }

    if (
      STYLE_EXTS.has(ext) &&
      /@keyframes\b/.test(content) &&
      !/prefers-reduced-motion/.test(content)
    ) {
      push(
        warnings,
        1,
        "missing-reduced-motion",
        "Custom @keyframes detected without a @media (prefers-reduced-motion: reduce) fallback."
      );
    }

    // Standalone HTML declaring a webfont without importing it (skip CSP-sandboxed Antigravity generative_ui widgets)
    if (
      (ext === ".html" || ext === ".htm") &&
      !/gstatic\.com\/antigravity/i.test(content)
    ) {
      const customFontMatch = content.match(
        /font-family\s*:[^;]*\b(Plus Jakarta Sans|IBM Plex Sans|Newsreader|Instrument Serif|Fraunces|Space Grotesk|Chakra Petch|Rajdhani|Cinzel|Cormorant Garamond|JetBrains Mono|DM Sans|Manrope|Outfit|Bricolage Grotesque|Geist)\b/i
      );
      const hasFontImport =
        /fonts\.googleapis\.com|fonts\.bunny\.net|@font-face|@import\s+url/i.test(
          content
        );
      if (customFontMatch && !hasFontImport) {
        push(
          errors,
          1,
          "unloaded-webfont-html",
          `Declared "${customFontMatch[1]}" in standalone HTML without a Google Fonts <link> or @font-face; browser will silently fall back to system Arial/Times.`
        );
      }
    }

    // Display-only font applied globally to body / :root
    const bodyDisplayMatch = content.match(
      /(?:body|:root)\s*\{[^}]*font-family\s*:[^;]*(Cinzel|Orbitron|Press Start 2P|Fraunces|Instrument Serif|Syne|Bangers|Chakra Petch)\b/i
    );
    if (bodyDisplayMatch) {
      push(
        errors,
        1,
        "display-font-on-body",
        `Do not apply display-only font "${bodyDisplayMatch[1]}" globally to body/:root; reserve it for headings and pair with a clean readable UI/body font.`
      );
    }

    // Competing bright neon rainbow colors in one file
    const neonHits = [
      /#4ade80/i,
      /#22c55e/i,
      /#38bdf8/i,
      /#22d3ee/i,
      /#fb7185/i,
      /#f472b6/i,
      /#a855f7/i,
      /#c084fc/i,
      /#e09f3e/i,
      /#f59e0b/i,
      /#84cc16/i,
    ].filter((re) => re.test(content));
    if (neonHits.length >= 4) {
      push(
        warnings,
        1,
        "neon-rainbow-soup",
        `Found ${neonHits.length} competing bright accent/neon hex hues in one file; stick to 1 primary accent and keep secondary tags muted/tonal.`
      );
    }

    // Complex UI markup with zero bespoke inline <svg>
    if (isWebMarkup && lines.length >= 80 && !/<svg\b/i.test(content)) {
      push(
        warnings,
        1,
        "missing-custom-svg",
        "Substantial UI view contains zero inline <svg> icons or illustrations; craft bespoke inline <svg> assets for visual anchors."
      );
    }
  }

  return { errors, warnings };
}

function collectFiles(targetPath, out = []) {
  if (!fs.existsSync(targetPath)) return out;
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    if (isUiFile(targetPath)) out.push(targetPath);
    return out;
  }
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
      if (SKIP_DIRS.has(entry.name)) continue;
      collectFiles(path.join(targetPath, entry.name), out);
    }
  }
  return out;
}

export function auditPaths(paths) {
  const allErrors = [];
  const allWarnings = [];
  const seen = new Set();

  for (const p of paths) {
    for (const file of collectFiles(path.resolve(p))) {
      if (seen.has(file)) continue;
      seen.add(file);
      const { errors, warnings } = auditFile(file);
      allErrors.push(...errors);
      allWarnings.push(...warnings);
    }
  }

  return { errors: allErrors, warnings: allWarnings, filesChecked: seen.size };
}

// CLI execution
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const targets = process.argv.slice(2);
  if (targets.length === 0) {
    console.error("Usage: node audit_ui_slop.mjs <file-or-dir> [...]");
    process.exit(2);
  }
  const res = auditPaths(targets);
  for (const f of res.errors) {
    console.log(`[ERROR] ${f.file}:${f.line} (${f.rule}) - ${f.message}`);
  }
  for (const w of res.warnings) {
    console.log(`[WARN]  ${w.file}:${w.line} (${w.rule}) - ${w.message}`);
  }
  console.log(
    `Checked ${res.filesChecked} UI file(s): ${res.errors.length} error(s), ${res.warnings.length} warning(s).`
  );
  process.exit(res.errors.length > 0 ? 1 : 0);
}
