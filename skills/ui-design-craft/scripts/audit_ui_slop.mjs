#!/usr/bin/env node
/**
 * Anti-AI-Slop UI Auditor (Web, Desktop, Mobile, Video Game UI)
 * Zero-dependency Node script usable from CLI or imported by hooks.
 *
 * Usage:
 *   node audit_ui_slop.mjs [--strict] [--json] <file-or-dir> [...]
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
const GAME_UI_EXTS = new Set([".uxml", ".uss"]);
const NATIVE_UI_EXTS = new Set([".qml", ".uxml", ".xaml", ".dart", ".swift", ".kt"]);

const UI_EXTS = new Set([
  ...WEB_MARKUP_EXTS,
  ...STYLE_EXTS,
  ...NATIVE_UI_EXTS,
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

const DEFAULT_CUSTOM_FONTS = [
  "Plus Jakarta Sans",
  "IBM Plex Sans",
  "Newsreader",
  "Instrument Serif",
  "Fraunces",
  "Space Grotesk",
  "Chakra Petch",
  "Rajdhani",
  "Cinzel",
  "Cormorant Garamond",
  "JetBrains Mono",
  "DM Sans",
  "Manrope",
  "Outfit",
  "Bricolage Grotesque",
  "Geist",
];

const NEON_HEX_BUCKETS = [
  { bucket: "green", re: /#(?:4ade80|22c55e)\b/i },
  { bucket: "cyan", re: /#(?:38bdf8|22d3ee)\b/i },
  { bucket: "pink", re: /#(?:fb7185|f472b6)\b/i },
  { bucket: "purple", re: /#(?:a855f7|c084fc)\b/i },
  { bucket: "amber", re: /#(?:e09f3e|f59e0b)\b/i },
  { bucket: "lime", re: /#84cc16\b/i },
];

const TAILWIND_NEON_BUCKET_MAP = {
  green: "green",
  emerald: "green",
  lime: "lime",
  sky: "cyan",
  cyan: "cyan",
  rose: "pink",
  pink: "pink",
  purple: "purple",
  violet: "purple",
  fuchsia: "purple",
  amber: "amber",
  yellow: "amber",
};

const EMOJI_SLOP_RE =
  /[\u{2728}\u{1F680}\u{26A1}\u{1F525}\u{1F3AF}\u{1F4A1}\u{1F4E6}\u{1F6E1}\u{2694}\u{1F4CA}\u{1F389}\u{1F48E}\u{1F916}\u{1F3A8}\u{1F4CC}\u{1F514}\u{26A0}\u{1F9E0}\u{1F31F}\u{1F52E}]/u;

const BUZZWORD_RE =
  /\b(Supercharge your|Unlock the power of|Elevate your workflow|Next-gen platform|Seamless experience|Revolutionize|AI-powered|All-in-one solution|Game-changer|Acme Corp|John Doe|Jane Doe|Jane Smith|Lorem ipsum|test@example\.com|foo@bar\.com)\b/i;

export function isUiFile(filePath) {
  return UI_EXTS.has(path.extname(filePath).toLowerCase());
}

function isIgnoredLine(line) {
  return line.includes("ui-craft-ignore");
}

/**
 * Load optional .uicraftrc.json from startDir upward to filesystem root.
 */
export function loadConfig(startDir = process.cwd()) {
  let dir = path.resolve(startDir);
  while (true) {
    const candidate = path.join(dir, ".uicraftrc.json");
    if (fs.existsSync(candidate)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(candidate, "utf8"));
        return {
          disabledRules: new Set(
            Array.isArray(parsed.disabledRules) ? parsed.disabledRules : []
          ),
          ignorePaths: Array.isArray(parsed.ignorePaths)
            ? parsed.ignorePaths
            : [],
          allowFonts: new Set(
            Array.isArray(parsed.allowFonts)
              ? parsed.allowFonts.map((f) => String(f).toLowerCase())
              : []
          ),
        };
      } catch {
        break;
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return {
    disabledRules: new Set(),
    ignorePaths: [],
    allowFonts: new Set(),
  };
}

function isPathIgnored(filePath, ignorePaths) {
  if (!ignorePaths || ignorePaths.length === 0) return false;
  const normalized = filePath.replace(/\\/g, "/");
  return ignorePaths.some((pattern) => normalized.includes(String(pattern)));
}

/**
 * Scan multi-line opening HTML/JSX/Vue/Svelte tags while respecting quotes and `{...}` expressions.
 */
function extractOpeningTags(content) {
  const tags = [];
  const len = content.length;
  let line = 1;

  for (let i = 0; i < len; i++) {
    const ch = content[i];
    if (ch === "\n") {
      line++;
      continue;
    }
    if (ch !== "<") continue;

    // Avoid TypeScript generics (useState<string>) and arithmetic (a<b)
    const prev = i > 0 ? content[i - 1] : "";
    if (/[A-Za-z0-9_$]/.test(prev)) continue;

    const next = content[i + 1] || "";
    if (!/[A-Za-z]/.test(next)) continue;

    const startLine = line;
    let nameEnd = i + 1;
    while (nameEnd < len && /[A-Za-z0-9_.:-]/.test(content[nameEnd])) {
      nameEnd++;
    }
    const tagName = content.slice(i + 1, nameEnd).toLowerCase();

    // Must be followed by whitespace, '/', or '>'
    const afterName = content[nameEnd] || "";
    if (!/[\s/>]/.test(afterName)) continue;

    let j = nameEnd;
    let quote = "";
    let braceDepth = 0;
    let tagLine = line;
    let closed = false;
    const maxEnd = Math.min(len, i + 4000);

    while (j < maxEnd) {
      const c = content[j];
      if (c === "\n") tagLine++;

      if (quote) {
        if (c === "\\" && j + 1 < maxEnd) {
          j += 2;
          continue;
        }
        if (c === quote) quote = "";
        j++;
        continue;
      }

      if (c === '"' || c === "'" || c === "`") {
        quote = c;
        j++;
        continue;
      }
      if (c === "{") {
        braceDepth++;
        j++;
        continue;
      }
      if (c === "}" && braceDepth > 0) {
        braceDepth--;
        j++;
        continue;
      }
      if (c === ">" && braceDepth === 0) {
        closed = true;
        j++;
        break;
      }
      j++;
    }

    if (closed) {
      const raw = content.slice(i, j);
      tags.push({
        tagName,
        raw,
        startLine,
        endLine: tagLine,
        startOffset: i,
        endOffset: j,
      });
      line = tagLine;
      i = j - 1;
    }
  }

  return tags;
}

function isMurkyGreenHex(hex) {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return false;
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return Math.max(r, g, b) <= 45 && g - r >= 5 && g - b >= 3;
}

function getLineSpanText(lines, startLine, endLine) {
  return lines.slice(startLine - 1, endLine).join("\n");
}

/**
 * Audit a single UI source file and return { errors: Finding[], warnings: Finding[] }.
 */
export function auditFile(filePath, options = {}) {
  const errors = [];
  const warnings = [];
  const config = options.config || loadConfig(path.dirname(path.resolve(filePath)));

  if (!isUiFile(filePath) || !fs.existsSync(filePath)) {
    return { errors, warnings };
  }
  if (isPathIgnored(filePath, config.ignorePaths)) {
    return { errors, warnings };
  }

  const stat = fs.statSync(filePath);
  if (!stat.isFile() || stat.size > 1024 * 1024) {
    return { errors, warnings };
  }

  const content = fs.readFileSync(filePath, "utf8");
  if (content.includes("ui-craft-ignore-file")) {
    return { errors, warnings };
  }

  const lines = content.split(/\r?\n/);
  const ext = path.extname(filePath).toLowerCase();
  const isWebMarkup = WEB_MARKUP_EXTS.has(ext);
  const isStyle = STYLE_EXTS.has(ext);
  const isWebOrStyle = isWebMarkup || isStyle;
  const isNative = NATIVE_UI_EXTS.has(ext);

  const push = (list, lineNum, rule, message) => {
    if (config.disabledRules.has(rule)) return;
    list.push({ file: filePath, line: lineNum, rule, message });
  };

  // 1. Line-by-line checks (copy, emojis, CSS declarations, native surfaces)
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    if (isIgnoredLine(line)) return;

    if (EMOJI_SLOP_RE.test(line) || /<\s*Sparkles(?:Icon)?\b/.test(line)) {
      push(
        errors,
        lineNum,
        "emoji-slop",
        "Avoid emoji icon crutches (✨/🚀/⚡/📦/🎉/💎/🛡️/etc.) or <Sparkles>; write bespoke inline <svg> icons or clean plain text."
      );
    }

    const buzzMatch = line.match(BUZZWORD_RE);
    if (buzzMatch) {
      push(
        errors,
        lineNum,
        "buzzword-copy",
        `Replace generic AI placeholder copy ("${buzzMatch[0]}") with concrete, domain-authentic copy or varied mock data.`
      );
    }

    if (isWebOrStyle) {
      if (/\bhover:scale-(105|110)\b/.test(line)) {
        push(
          errors,
          lineNum,
          "card-wobble",
          "Avoid hover:scale-105/110 wobble on containers; use crisp 120-180ms border, surface, or opacity shifts."
        );
      }

      if (
        /\bduration-(?:500|700|1000)\b/.test(line) ||
        /transition(?:-duration)?\s*:\s*(?:0\.[5-9]\d*|[1-9]\d*(?:\.\d+)?)s\b/i.test(
          line
        )
      ) {
        push(
          warnings,
          lineNum,
          "sluggish-transition",
          "UI transitions >= 500ms feel sluggish; keep interactive feedback crisp at 100ms-200ms."
        );
      }

      if (
        /font-family\s*:\s*['"]?(Arial|Helvetica Neue|Times New Roman|Comic Sans)\b/i.test(
          line
        )
      ) {
        push(
          warnings,
          lineNum,
          "generic-font-slop",
          "Avoid generic Arial/Times/Comic Sans as primary font; pick a curated domain font pairing or clean OS system UI stack."
        );
      }

      if (
        /\bbg-black\b(?!\/)/.test(line) ||
        /\bbg-\[#000(?:000)?\]\b(?!\/)/i.test(line) ||
        /background(?:-color)?\s*:\s*#000(?:000)?\s*;/i.test(line)
      ) {
        push(
          warnings,
          lineNum,
          "pure-black-background",
          "Avoid solid #000000 / bg-black backgrounds; use calibrated deep charcoal/obsidian (#0B0D10-#141619) matched to your undertone."
        );
      }

      if (/\bbg-(?:emerald|green|teal|lime)-950\b(?!\/)/.test(line)) {
        push(
          warnings,
          lineNum,
          "murky-tinted-dark-bg",
          "Avoid murky green/teal-tinted dark backgrounds (bg-emerald/green/teal-950); use crisp low-chroma obsidian/charcoal neutrals."
        );
      } else {
        const bgHexMatch = line.match(
          /(?:background(?:-color)?\s*:\s*|bg-\[)(#[0-9a-f]{6})\b/i
        );
        if (bgHexMatch && isMurkyGreenHex(bgHexMatch[1])) {
          push(
            warnings,
            lineNum,
            "murky-tinted-dark-bg",
            `Avoid murky green-tinted dark surface (${bgHexMatch[1]}); use crisp low-chroma charcoal/obsidian (#0D0F12-#16191E).`
          );
        }
      }
    }

    if (isStyle) {
      if (
        /\boutline\s*:\s*(?:none|0)\b/i.test(line) &&
        !/:focus-visible/.test(getLineSpanText(lines, Math.max(1, lineNum - 3), Math.min(lines.length, lineNum + 5)))
      ) {
        push(
          errors,
          lineNum,
          "missing-focus-ring",
          "outline: none/0 without a nearby :focus-visible ring breaks keyboard navigation."
        );
      }

      if (
        /background(?:-image)?\s*:[^;]*gradient\([^;]*(?:#0f172a|#1e293b)[^;]*(?:#6366f1|#8b5cf6|#a855f7|#ec4899)/i.test(
          line
        )
      ) {
        push(
          errors,
          lineNum,
          "ai-gradient-slop",
          "Detected dark-slate + indigo/purple/pink CSS gradient cliché. Switch to a calibrated 60-30-10 domain palette."
        );
      }
    }

    if (isNative) {
      if (
        /\bColors\.black\b/.test(line) ||
        /\bColor\.black\b/.test(line) ||
        /(?:background(?:-color)?|color)\s*[:=]\s*["']?#(?:ff)?000000["']?/i.test(
          line
        )
      ) {
        push(
          warnings,
          lineNum,
          "pure-black-background",
          "Avoid raw pure black (#000000 / Colors.black / Color.black) on native surfaces; use calibrated deep obsidian (#0D0F12-#16191E)."
        );
      }
    }

    if (GAME_UI_EXTS.has(ext) && /font-size\s*:\s*(?:[1-9]|1[0-3])px\b/i.test(line)) {
      push(
        warnings,
        lineNum,
        "tiny-game-ui-text",
        "Game UI text below 14px is unreadable at 1080p/handheld distance; scale body/subtitles to >= 18-22px."
      );
    }

    if (isWebMarkup) {
      const sanitized = line
        .replace(/https?:\/\/[^\s"'`]+/g, "")
        .replace(/\?\.|\?\?/g, "");
      const qCount = (sanitized.match(/\?/g) || []).length;
      const cCount = (sanitized.match(/:/g) || []).length;
      if (qCount >= 2 && cCount >= 2 && /\?[^?\n]*\?/.test(sanitized)) {
        push(
          warnings,
          lineNum,
          "confusing-nested-ternary",
          "Nested ternary expressions impair human and AI maintainability; extract a helper function, lookup map, or early return."
        );
      }
    }
  });

  // 2. Multi-line tag checks for HTML/JSX/Vue/Svelte/Astro
  if (isWebMarkup) {
    const hasAnyLabelElement = /<\s*label\b/i.test(content);
    const tags = extractOpeningTags(content);
    for (const tag of tags) {
      const spanText = getLineSpanText(lines, tag.startLine, tag.endLine);
      if (isIgnoredLine(spanText)) continue;

      const { raw, tagName, startLine } = tag;

      if (/\bbg-clip-text\b/.test(raw) && /\btext-transparent\b/.test(raw)) {
        push(
          errors,
          startLine,
          "gradient-text-slop",
          "Avoid bg-clip-text text-transparent hero gradient text; use high-contrast solid ink with deliberate weight/scale hierarchy."
        );
      }

      if (
        /\boutline-none\b/.test(raw) &&
        !/focus-visible:|focus:ring|focus-within:/.test(raw)
      ) {
        push(
          errors,
          startLine,
          "missing-focus-ring",
          "outline-none without a visible focus-visible ring breaks keyboard navigation; pair with focus-visible:ring-2."
        );
      }

      if (
        /\btext-white\b/.test(raw) &&
        /\bbg-(?:yellow|amber|lime)-[345]00\b|\bbg-(?:cyan|emerald|green|teal)-[34]00\b/.test(
          raw
        )
      ) {
        push(
          errors,
          startLine,
          "low-contrast-accent-text",
          "text-white on bright yellow/amber/lime/cyan/emerald-400 fails WCAG contrast; use dark ink (text-neutral-950) or darken the accent surface."
        );
      }

      if (
        /\bbg-(?:indigo|purple|violet|pink)-[45]00\/(?:10|15|20|25)\b/.test(raw) &&
        /\bborder-(?:indigo|purple|violet|pink)-[45]00\//.test(raw)
      ) {
        push(
          errors,
          startLine,
          "neon-translucent-slop",
          "Avoid muddy neon translucent boxes (bg-purple-500/20 border-purple-500/...); use tonal neutral surfaces with 1px hairline borders."
        );
      }

      if (
        (tagName === "div" || tagName === "span") &&
        /(?:\bonClick|@click|on:click)\s*=/.test(raw) &&
        !/\brole\s*=/.test(raw)
      ) {
        push(
          errors,
          startLine,
          "non-semantic-click",
          `Use native <button type="button"> or <a href> instead of clickable <${tagName}> without role/keyboard support.`
        );
      }

      if (
        /\bleading-none\b/.test(raw) &&
        (/^h[1-4]$/.test(tagName) ||
          /\btext-(?:xl|2xl|3xl|4xl|5xl|6xl)\b/.test(raw) ||
          /\buppercase\b/.test(raw))
      ) {
        push(
          warnings,
          startLine,
          "diacritic-leading-clip",
          "Avoid leading-none on headings or uppercase labels; keep line-height >= 1.12 (>= 1.25 uppercase) so Turkish diacritics (İ, Ş, Ğ) never clip."
        );
      }

      if (tagName === "img" && !/\balt\s*=/.test(raw) && !/\{\s*\.\.\./.test(raw)) {
        push(
          warnings,
          startLine,
          "img-missing-alt",
          'Every <img> must include an alt attribute (use alt="" for purely decorative images).'
        );
      }

      if (
        tagName === "button" &&
        !/\btype\s*=/.test(raw) &&
        !/\{\s*\.\.\./.test(raw)
      ) {
        push(
          warnings,
          startLine,
          "button-missing-type",
          'Specify type="button" (or "submit"/"reset") on <button> to prevent accidental form submissions.'
        );
      }

      if (
        (tagName === "input" || tagName === "select" || tagName === "textarea") &&
        /\bplaceholder\s*=/.test(raw) &&
        !/\btype\s*=\s*["']hidden["']/i.test(raw) &&
        !/\b(?:aria-label|aria-labelledby|title)\s*=/.test(raw) &&
        !/\{\s*\.\.\./.test(raw) &&
        !hasAnyLabelElement
      ) {
        push(
          warnings,
          startLine,
          "placeholder-only-input",
          `Placeholder-only <${tagName}> without a visible <label> or aria-label creates accessibility-tree labeling debt.`
        );
      }

      if (
        tagName === "button" &&
        !/\b(?:aria-label|aria-labelledby|title)\s*=/.test(raw) &&
        !/\{\s*\.\.\./.test(raw)
      ) {
        const tail = content.slice(tag.endOffset, tag.endOffset + 2000);
        const iconOnlyBody = tail.match(
          /^\s*(?:<svg\b[\s\S]*?<\/svg>|<[A-Z][A-Za-z0-9]*Icon\b[^>]*\/>)\s*<\/button>/
        );
        if (iconOnlyBody && !/\bsr-only\b/.test(iconOnlyBody[0])) {
          push(
            warnings,
            startLine,
            "icon-button-missing-label",
            "Icon-only <button> lacks an accessible name; add aria-label or .sr-only text."
          );
        }
      }
    }
  }

  // 3. File-level pattern checks
  if (isWebOrStyle) {
    const hasDarkSlate = /\bbg-slate-9[05]0\b|#0f172a\b/i.test(content);
    const hasPurpleIndigoGrad =
      /\b(?:from|via|to)-(?:indigo|purple|violet|pink)-[456]00\b|#6366f1\b|#8b5cf6\b|#a855f7\b|#ec4899\b/i.test(
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
      /\b(?:flex|grid)\b/.test(content) &&
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
      /\btext-(?:2xl|3xl|4xl)\b/.test(content) &&
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
      isStyle &&
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

    // Standalone HTML declaring a webfont without importing it (skip CSP-sandboxed Antigravity widgets)
    if (
      (ext === ".html" || ext === ".htm") &&
      !/gstatic\.com\/antigravity/i.test(content)
    ) {
      const fontAlt = DEFAULT_CUSTOM_FONTS.join("|");
      const customFontRe = new RegExp(
        `font-family\\s*:[^;]*\\b(${fontAlt})\\b`,
        "i"
      );
      const customFontMatch = content.match(customFontRe);
      const hasFontImport =
        /fonts\.googleapis\.com|fonts\.bunny\.net|@font-face|@import\s+url|@fontsource|next\/font/i.test(
          content
        );
      if (
        customFontMatch &&
        !hasFontImport &&
        !config.allowFonts.has(customFontMatch[1].toLowerCase())
      ) {
        push(
          errors,
          1,
          "unloaded-webfont-html",
          `Declared "${customFontMatch[1]}" in standalone HTML without a Google Fonts <link>, @font-face, or @fontsource import; browser will fall back to system fonts.`
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

    // Competing bright neon rainbow hues (hex + Tailwind utility classes)
    const neonBuckets = new Set();
    for (const entry of NEON_HEX_BUCKETS) {
      if (entry.re.test(content)) neonBuckets.add(entry.bucket);
    }
    const twNeonMatches = content.matchAll(
      /\b(?:text|bg|border)-(green|emerald|lime|sky|cyan|rose|pink|purple|violet|fuchsia|amber|yellow)-[345]00\b/g
    );
    for (const match of twNeonMatches) {
      const bucket = TAILWIND_NEON_BUCKET_MAP[match[1]];
      if (bucket) neonBuckets.add(bucket);
    }
    if (neonBuckets.size >= 4) {
      push(
        warnings,
        1,
        "neon-rainbow-soup",
        `Found ${neonBuckets.size} competing bright accent/neon hue families (${Array.from(neonBuckets).join(", ")}) in one file; stick to 1 primary accent and keep secondary tags muted/tonal.`
      );
    }

    if (isWebMarkup) {
      const boldHits = (content.match(/\bfont-bold\b/g) || []).length;
      const calibratedWeights = /\bfont-(?:medium|semibold)\b/.test(content);
      if (boldHits >= 6 && !calibratedWeights) {
        push(
          warnings,
          1,
          "font-bold-monotony",
          `Detected ${boldHits} occurrences of font-bold without font-medium/font-semibold hierarchy; calibrate weights (400/500/600).`
        );
      }

      const hasSvgOrIconComponent =
        /<svg\b/i.test(content) ||
        /from\s+['"][^'"]*icon[^'"]*['"]/i.test(content) ||
        /<[A-Z][A-Za-z0-9]*Icon\b/.test(content);
      if (lines.length >= 80 && !hasSvgOrIconComponent) {
        push(
          warnings,
          1,
          "missing-custom-svg",
          "Substantial UI view contains zero inline <svg> icons or illustrations; craft bespoke inline <svg> assets for visual anchors."
        );
      }
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

export function auditPaths(paths, options = {}) {
  const allErrors = [];
  const allWarnings = [];
  const seen = new Set();

  for (const p of paths) {
    for (const file of collectFiles(path.resolve(p))) {
      if (seen.has(file)) continue;
      seen.add(file);
      const { errors, warnings } = auditFile(file, options);
      allErrors.push(...errors);
      allWarnings.push(...warnings);
    }
  }

  return { errors: allErrors, warnings: allWarnings, filesChecked: seen.size };
}

function parseCliArgs(argv) {
  const targets = [];
  let strict = false;
  let json = false;
  let help = false;

  for (const arg of argv) {
    if (arg === "--strict") strict = true;
    else if (arg === "--json") json = true;
    else if (arg === "--help" || arg === "-h") help = true;
    else targets.push(arg);
  }
  return { targets, strict, json, help };
}

// CLI execution
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const { targets, strict, json, help } = parseCliArgs(process.argv.slice(2));
  if (help || targets.length === 0) {
    const out = help ? console.log : console.error;
    out("Usage: node audit_ui_slop.mjs [--strict] [--json] <file-or-dir> [...]");
    process.exit(help ? 0 : 2);
  }

  const res = auditPaths(targets);
  if (json) {
    console.log(
      JSON.stringify(
        {
          filesChecked: res.filesChecked,
          errorCount: res.errors.length,
          warningCount: res.warnings.length,
          strict,
          errors: res.errors,
          warnings: res.warnings,
        },
        null,
        2
      )
    );
  } else {
    for (const f of res.errors) {
      console.log(`[ERROR] ${f.file}:${f.line} (${f.rule}) - ${f.message}`);
    }
    for (const w of res.warnings) {
      console.log(`[WARN]  ${w.file}:${w.line} (${w.rule}) - ${w.message}`);
    }
    console.log(
      `Checked ${res.filesChecked} UI file(s): ${res.errors.length} error(s), ${res.warnings.length} warning(s).`
    );
  }

  const failed = res.errors.length > 0 || (strict && res.warnings.length > 0);
  process.exit(failed ? 1 : 0);
}
