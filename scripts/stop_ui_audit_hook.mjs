#!/usr/bin/env node
/**
 * Antigravity Stop hook for ui-design-craft.
 * Inspects only UI files written/edited during the current user turn.
 * Fail-open: any parse/IO issue outputs {} and allows normal completion.
 */

import fs from "node:fs";
import path from "node:path";
import {
  auditPaths,
  isUiFile,
} from "../skills/ui-design-craft/scripts/audit_ui_slop.mjs";

function allowStop() {
  process.stdout.write("{}");
}

function unquoteArg(val) {
  if (typeof val !== "string") return "";
  const trimmed = val.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

function extractModifiedUiFilesSinceLastUserInput(transcriptPath, cwd) {
  const raw = fs.readFileSync(transcriptPath, "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const steps = [];

  for (const line of lines) {
    try {
      steps.push(JSON.parse(line));
    } catch {
      // Ignore partial/malformed trailing line
    }
  }

  let lastUserIdx = -1;
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i]?.type === "USER_INPUT") {
      lastUserIdx = i;
      break;
    }
  }

  const touched = new Set();
  const slice = lastUserIdx >= 0 ? steps.slice(lastUserIdx + 1) : steps;

  for (const step of slice) {
    const calls = Array.isArray(step?.tool_calls) ? step.tool_calls : [];
    for (const call of calls) {
      if (call?.name !== "write_file" && call?.name !== "edit_file") continue;
      const rawPath = unquoteArg(call?.args?.Path || call?.args?.path || "");
      if (!rawPath) continue;
      const resolved = path.isAbsolute(rawPath)
        ? rawPath
        : cwd
          ? path.resolve(cwd, rawPath)
          : path.resolve(rawPath);
      if (isUiFile(resolved) && fs.existsSync(resolved)) {
        touched.add(resolved);
      }
    }
  }

  return Array.from(touched);
}

try {
  const stdinRaw = fs.readFileSync(0, "utf8").trim();
  if (!stdinRaw) {
    allowStop();
    process.exit(0);
  }

  const payload = JSON.parse(stdinRaw);

  // Never loop if already continued once, or if terminated abnormally
  if (payload.continuationActive) {
    allowStop();
    process.exit(0);
  }
  if (
    payload.terminationReason &&
    payload.terminationReason !== "NO_TOOL_CALL"
  ) {
    allowStop();
    process.exit(0);
  }

  const transcriptPath = payload.transcriptPath;
  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    allowStop();
    process.exit(0);
  }

  const uiFiles = extractModifiedUiFilesSinceLastUserInput(
    transcriptPath,
    payload.cwd
  );

  if (uiFiles.length === 0) {
    allowStop();
    process.exit(0);
  }

  const { errors } = auditPaths(uiFiles);
  if (errors.length === 0) {
    allowStop();
    process.exit(0);
  }

  const topFindings = errors
    .slice(0, 8)
    .map((e) => `- ${e.file}:${e.line} [${e.rule}] ${e.message}`)
    .join("\n");

  const extra =
    errors.length > 8 ? `\n...and ${errors.length - 8} more issue(s).` : "";

  process.stdout.write(
    JSON.stringify({
      decision: "continue",
      reason:
        `ui-design-craft automated audit found ${errors.length} AI-slop / UI quality error(s) in files you modified this turn. Fix them before finishing:\n` +
        topFindings +
        extra,
    })
  );
} catch {
  allowStop();
}
