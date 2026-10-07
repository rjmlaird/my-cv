/**
 * Normalises and filters URLs for schema.org `sameAs`.
 * - https only, lowercase host, no `www.`, no fragment, no trailing slash
 * - twitter.com is folded into x.com
 * - messaging/contact links (wa.me, signal.me, t.me …) are not identity profiles, so dropped
 */
const EXCLUDED_HOSTS = new Set([
  "wa.me",
  "api.whatsapp.com",
  "whatsapp.com",
  "signal.me",
  "t.me",
  "telegram.me",
]);

export function normaliseProfileUrl(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return undefined;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;

  let host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "twitter.com") host = "x.com";
  if (EXCLUDED_HOSTS.has(host)) return undefined;

  const path = url.pathname.replace(/\/+$/, "");
  return `https://${host}${path}${url.search}`;
}

/** Normalise, filter and dedupe (case-insensitively), preserving first-seen order. */
export function buildSameAs(urls: Array<string | null | undefined>, exclude: string[] = []): string[] {
  const excluded = new Set(exclude.map((u) => normaliseProfileUrl(u)?.toLowerCase()).filter(Boolean));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of urls) {
    const n = normaliseProfileUrl(raw);
    if (!n) continue;
    const key = n.toLowerCase();
    if (seen.has(key) || excluded.has(key)) continue;
    seen.add(key);
    out.push(n);
  }
  return out;
}
