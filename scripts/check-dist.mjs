#!/usr/bin/env node
/**
 * Post-build sanity checks on ./dist. Run with `pnpm check:dist` (CI runs it after `pnpm build`).
 * Exits non-zero on any failure. Broken in-page anchors are reported as warnings only, because
 * sections that legitimately render nothing can leave a nav link dead.
 */
import { readFile, access } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve(process.argv[2] ?? "dist");
const failures = [];
const warnings = [];
const fail = (m) => failures.push(m);
const warn = (m) => warnings.push(m);
const exists = (p) => access(p).then(() => true, () => false);

// Canonical identity comes from the single source of truth.
const config = await readFile("src/config/site.ts", "utf8");
const grab = (name) => config.match(new RegExp(`${name}\\s*=\\s*"([^"]+)"`))?.[1];
const SITE_URL = grab("SITE_URL");
const CANONICAL = grab("CANONICAL_SITE_URL");
if (!SITE_URL || !CANONICAL) throw new Error("Could not read SITE_URL / CANONICAL_SITE_URL from src/config/site.ts");
const PERSON_ID = `${CANONICAL}/#person`;

const count = (html, re) => (html.match(re) ?? []).length;

// ---- Main CV page -------------------------------------------------------
const indexPath = path.join(dist, "index.html");
if (!(await exists(indexPath))) {
  fail("dist/index.html is missing");
} else {
  const html = await readFile(indexPath, "utf8");

  const mains = count(html, /<main[\s>]/g);
  if (mains !== 1) fail(`index.html: expected exactly one <main>, found ${mains}`);
  if (!/<html[^>]*lang="en-GB"/.test(html)) fail('index.html: <html lang="en-GB"> missing');
  if (/content="noindex/.test(html)) fail("index.html: main CV page is marked noindex");
  if (!new RegExp(`<link rel="canonical" href="${SITE_URL.replace(/[.]/g, "\\.")}/?"`).test(html)) {
    fail(`index.html: canonical link is not ${SITE_URL}/`);
  }

  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (blocks.length !== 1) {
    fail(`index.html: expected exactly one JSON-LD block, found ${blocks.length}`);
  } else {
    const raw = blocks[0][1];
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      fail(`index.html: JSON-LD is not valid JSON (${e.message})`);
    }
    if (data) {
      const graph = data["@graph"] ?? [];
      const byId = new Map(graph.filter((n) => n["@id"]).map((n) => [n["@id"], n]));
      const person = graph.find((n) => n["@type"] === "Person");
      const page = graph.find((n) => n["@type"] === "ProfilePage");
      const site = graph.find((n) => n["@type"] === "WebSite");

      if (!person) fail("JSON-LD: no Person node");
      else if (person["@id"] !== PERSON_ID) fail(`JSON-LD: Person @id is ${person["@id"]}, expected ${PERSON_ID}`);
      if (!page) fail("JSON-LD: no ProfilePage node");
      else {
        if (page.mainEntity?.["@id"] !== PERSON_ID) fail("JSON-LD: ProfilePage.mainEntity is not the canonical Person");
        if (!page.dateModified) fail("JSON-LD: ProfilePage.dateModified missing");
        if (!page.dateCreated) fail("JSON-LD: ProfilePage.dateCreated missing");
      }
      if (!site) fail("JSON-LD: no WebSite node");
      else if (!site.isPartOf?.["@id"]?.startsWith(CANONICAL)) fail("JSON-LD: WebSite.isPartOf does not reference the main site");

      // Every {"@id": ...}-only reference must resolve in-graph or point at the main site.
      const walk = (v) => {
        if (Array.isArray(v)) return v.forEach(walk);
        if (v && typeof v === "object") {
          const keys = Object.keys(v);
          if (keys.length === 1 && keys[0] === "@id" && !byId.has(v["@id"]) && !v["@id"].startsWith(CANONICAL)) {
            fail(`JSON-LD: unresolved @id reference ${v["@id"]}`);
          }
          Object.values(v).forEach(walk);
        }
      };
      walk(graph);

      if (/mailto:|[\w.+-]+@[\w-]+\.[\w.]+/.test(raw)) fail("JSON-LD: contains an email address (must not)");
      for (const u of person?.sameAs ?? []) {
        if (/\/\/(wa\.me|signal\.me|t\.me)\//.test(u)) fail(`JSON-LD: sameAs contains a messaging link: ${u}`);
        if (!u.startsWith("https://")) fail(`JSON-LD: sameAs entry is not https: ${u}`);
      }
      if (new Set((person?.sameAs ?? []).map((u) => u.toLowerCase())).size !== (person?.sameAs ?? []).length) {
        fail("JSON-LD: sameAs contains duplicates");
      }
      const wf = person?.worksFor;
      if (Array.isArray(wf) && wf.length > 1) fail("JSON-LD: worksFor lists more than the current employer");
    }
  }

  // In-page anchors (warning only).
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const dead = new Set();
  for (const m of html.matchAll(/\shref="#([^"]+)"/g)) if (!ids.has(m[1])) dead.add(m[1]);
  if (dead.size) warn(`index.html: in-page links with no matching id: ${[...dead].join(", ")}`);
}

// ---- ATS page ------------------------------------------------------------
const atsPath = path.join(dist, "ats", "index.html");
if (!(await exists(atsPath))) {
  fail("dist/ats/index.html is missing");
} else {
  const html = await readFile(atsPath, "utf8");
  if (!/<meta name="robots" content="noindex/.test(html)) fail("ats/index.html: not marked noindex");
  if (count(html, /<main[\s>]/g) !== 1) fail("ats/index.html: expected exactly one <main>");
  if (/application\/ld\+json/.test(html)) fail("ats/index.html: should not emit JSON-LD");
}
if (await exists(path.join(dist, "AtsView"))) fail("dist/AtsView exists: the ATS component is being routed as a page");

// ---- Sitemap / robots ----------------------------------------------------
for (const f of ["sitemap-index.xml", "sitemap-0.xml"]) {
  const p = path.join(dist, f);
  if (await exists(p)) {
    const xml = await readFile(p, "utf8");
    if (/\/ats\/?</.test(xml)) fail(`${f}: contains the noindex /ats/ page`);
  }
}
if (!(await exists(path.join(dist, "robots.txt")))) fail("dist/robots.txt is missing");

// ---- Report --------------------------------------------------------------
for (const w of warnings) console.warn(`warn  ${w}`);
if (failures.length) {
  for (const f of failures) console.error(`FAIL  ${f}`);
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log(`dist checks passed${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
