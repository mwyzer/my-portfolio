// Shared XSS-safety helpers.
//
// Content in this app (blog posts, project links, profile fields) is edited
// through the dashboard by anyone with an `authenticated` Supabase session —
// it is NOT trusted, sanitized-at-write-time data. Treat it the same as
// arbitrary user input when rendering it back out.

const SAFE_URL_SCHEMES = ["http:", "https:", "mailto:", "tel:"];

/**
 * Returns the URL unchanged if its scheme is on the allowlist (or it's a
 * relative path), otherwise returns undefined so callers can skip rendering
 * the link entirely. Blocks `javascript:`, `data:`, `vbscript:`, etc.
 */
export function sanitizeUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  // Relative/root-relative paths and protocol-relative URLs are safe.
  if (/^(\/(?!\/)|#|\?)/.test(trimmed)) return trimmed;

  try {
    // Base URL only matters for relative resolution; scheme check below
    // covers absolute URLs regardless of base.
    const parsed = new URL(trimmed, "http://localhost");
    return SAFE_URL_SCHEMES.includes(parsed.protocol) ? trimmed : undefined;
  } catch {
    return undefined;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Minimal Markdown → HTML conversion that never lets raw HTML (or a
 * malicious link scheme) from the source reach the DOM. The source is
 * HTML-escaped first, then a constrained set of Markdown patterns are
 * turned into their corresponding tags.
 */
export function markdownToSafeHtml(markdown: string): string {
  const escaped = escapeHtml(markdown);

  return escaped
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
      // href/text are already HTML-escaped, so decode just enough to
      // validate the scheme, then re-escape for the attribute.
      const decoded = href.replace(/&amp;/g, "&");
      const safe = sanitizeUrl(decoded);
      return safe
        ? `<a href="${escapeHtml(safe)}" target="_blank" rel="noreferrer">${text}</a>`
        : text;
    })
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[a-z])/gm, "")
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith("<")) return match;
      return `<p>${match}</p>`;
    });
}
