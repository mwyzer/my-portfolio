/**
 * Test Logger — appends a timestamped entry to docs/testing/test-log.md
 * after each test run.  Called from npm scripts (test, test:smoke, test:all).
 *
 * Usage:
 *   node scripts/test-logger.mjs <suite> <passed> <failed> [detail...]
 *
 * Example:
 *   node scripts/test-logger.mjs "Vitest" 26 0 "lib/utils.test.ts" "components/ui/button.test.tsx"
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = join(__dirname, "..", "docs", "testing", "test-log.md");

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error("Usage: node scripts/test-logger.mjs <suite> <passed> <failed> [files...]");
  process.exit(1);
}

const [suite, passed, failed, ...files] = args;
const passedNum = Number(passed);
const failedNum = Number(failed);
const total = passedNum + failedNum;
const statusIcon = failedNum === 0 ? "✅" : "❌";

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

const fileRows = files.length > 0
  ? files.map((f) => `| \`${f}\` | ${failedNum === 0 ? "✅" : "❌"} |`).join("\n")
  : "| — | — |";

const entry = `

---

## ${timestamp} — ${suite}

**Result:** ${statusIcon} ${passedNum} passed, ${failedNum} failed

| File | Status |
|---|---|
${fileRows}

`;

// Prepend after the first heading line so newest is always at top
const headingEnd = "Latest run at the top.\n";
let existing = "";
if (existsSync(LOG_PATH)) {
  existing = readFileSync(LOG_PATH, "utf-8");
}

const idx = existing.indexOf(headingEnd);
if (idx !== -1) {
  const before = existing.slice(0, idx + headingEnd.length);
  const after = existing.slice(idx + headingEnd.length);
  writeFileSync(LOG_PATH, before + entry + after, "utf-8");
} else {
  // Fallback: append at end
  writeFileSync(LOG_PATH, existing + entry, "utf-8");
}

if (failedNum > 0) {
  console.log(`\n📋 Logged ${total} tests (${failedNum} failed) to docs/testing/test-log.md`);
  console.log(`   Please add error details manually under the new entry.`);
} else {
  console.log(`\n📋 Logged ${total} tests (all passing) to docs/testing/test-log.md`);
}
