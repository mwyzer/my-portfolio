/**
 * HTTP-level smoke tests — no browser needed.
 * Run: npx tsx tests/smoke/http.smoke.ts
 */

const BASE = process.env.SMOKE_BASE_URL || "http://localhost:3000";

const ENDPOINTS = [
  { path: "/", name: "Homepage", minStatus: 200, maxStatus: 299 },
  { path: "/blog", name: "Blog", minStatus: 200, maxStatus: 299 },
  { path: "/auth/login", name: "Login", minStatus: 200, maxStatus: 299 },
  { path: "/dashboard", name: "Dashboard", minStatus: 301, maxStatus: 399 },
  { path: "/api/auth", name: "Auth API", minStatus: 200, maxStatus: 401 },
  { path: "/nonexistent", name: "404 Page", minStatus: 404, maxStatus: 404 },
];

async function main() {
  let failures = 0;

  for (const { path, name, minStatus, maxStatus } of ENDPOINTS) {
    const url = `${BASE}${path}`;
    try {
      const res = await fetch(url, { redirect: "manual" });
      const ok = res.status >= minStatus && res.status <= maxStatus;
      const icon = ok ? "✅" : "❌";
      console.log(`${icon} ${name.padEnd(15)} ${res.status} ${url}`);
      if (!ok) failures++;
    } catch (err) {
      console.log(`❌ ${name.padEnd(15)} ERROR ${(err as Error).message}`);
      failures++;
    }
  }

  console.log(
    `\n${failures === 0 ? "✅ All smoke tests passed" : `❌ ${failures} failures`}`,
  );
  process.exit(failures > 0 ? 1 : 0);
}

main();
