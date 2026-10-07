#!/usr/bin/env node
/**
 * Live cross-site identity check. Run after both sites are deployed:
 *   pnpm check:live
 *   node scripts/check-federation.mjs --main https://rjmlaird.co.uk/ --cv https://cv.rjmlaird.co.uk/
 *
 * Verifies the CV and the main site agree on the Person @id and reference each other.
 * Exits non-zero on any failure.
 */
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const MAIN = arg("main", "https://rjmlaird.co.uk/");
const CV = arg("cv", "https://cv.rjmlaird.co.uk/");
const ATS = new URL("ats/", CV).toString();

const failures = [];
const notes = [];
const fail = (m) => failures.push(m);
const norm = (u) => String(u).toLowerCase().replace(/^http:/, "https:").replace(/\/+$/, "").replace("//www.", "//");

async function load(url) {
  const res = await fetch(url, { headers: { accept: "text/html" }, redirect: "follow" });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  const html = await res.text();
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch (e) {
      fail(`${url}: invalid JSON-LD (${e.message})`);
      return null;
    }
  });
  const nodes = blocks.filter(Boolean).flatMap((b) => (Array.isArray(b["@graph"]) ? b["@graph"] : [b]));
  return { html, nodes };
}
const ofType = (nodes, t) => nodes.filter((n) => [].concat(n["@type"]).includes(t));

let main, cv, ats;
try {
  [main, cv] = await Promise.all([load(MAIN), load(CV)]);
} catch (e) {
  console.error(`FAIL  could not fetch: ${e.message}`);
  process.exit(1);
}

const mainPerson = ofType(main.nodes, "Person").find((n) => n["@id"]);
const cvPerson = ofType(cv.nodes, "Person").find((n) => n["@id"]);
const cvPage = ofType(cv.nodes, "ProfilePage")[0];

if (!mainPerson) fail(`${MAIN}: no Person node with an @id`);
if (!cvPerson) fail(`${CV}: no Person node with an @id`);
if (mainPerson && cvPerson && mainPerson["@id"] !== cvPerson["@id"]) {
  fail(`Person @id differs: main=${mainPerson["@id"]} cv=${cvPerson["@id"]}`);
}
const expectedId = mainPerson?.["@id"];
if (cvPage) {
  if (cvPage.mainEntity?.["@id"] !== expectedId) fail("CV ProfilePage.mainEntity does not point at the main site's Person");
  if (!cvPage.dateModified) fail("CV ProfilePage has no dateModified");
  if (!cvPage.dateCreated) fail("CV ProfilePage has no dateCreated");
} else fail(`${CV}: no ProfilePage node`);

// Reciprocal links
const cvSameAs = [].concat(cvPerson?.sameAs ?? []).map(norm);
const mainSameAs = [].concat(mainPerson?.sameAs ?? []).map(norm);
if (!cvSameAs.includes(norm(MAIN))) fail("CV Person.sameAs does not include the main site");
if (!mainSameAs.includes(norm(CV))) fail("Main site Person.sameAs does not include the CV");

// Only one Person per site, no email, current employer only
for (const [label, site] of [["main", main], ["cv", cv]]) {
  const persons = ofType(site.nodes, "Person");
  if (persons.length > 1) fail(`${label}: ${persons.length} Person nodes on one page`);
  const jsonld = JSON.stringify(site.nodes);
  if (/mailto:|[\w.+-]+@[\w-]+\.[\w.]+/.test(jsonld)) fail(`${label}: JSON-LD contains an email address`);
}
const wf = [].concat(mainPerson?.worksFor ?? []);
if (wf.length > 1) fail("Main site Person.worksFor lists more than the current employer (use hasOccupation for past roles)");
if (mainPerson && !mainPerson.hasOccupation) notes.push("main: Person has no hasOccupation yet (expected once enriched from the API endpoint)");

// Canonicals
const canon = (html) => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
if (norm(canon(cv.html) ?? "") !== norm(CV)) fail(`CV canonical is ${canon(cv.html)}, expected ${CV}`);
if (norm(canon(main.html) ?? "") !== norm(MAIN)) fail(`Main canonical is ${canon(main.html)}, expected ${MAIN}`);

// ATS page
try {
  ats = await load(ATS);
  if (!/<meta name="robots" content="noindex/.test(ats.html)) fail("/ats/ is not noindex");
} catch (e) {
  fail(`ATS page: ${e.message}`);
}

// Does the main site also publish its own CV page that could duplicate this one?
const mainCvLink = [...main.html.matchAll(/href="([^"]*\/cv\/?)"/g)].map((m) => m[1])[0];
if (mainCvLink) notes.push(`main site links to its own CV route (${mainCvLink}). Decide: redirect it to the CV subdomain, or canonical it there, to avoid duplicate CV content`);

for (const n of notes) console.warn(`note  ${n}`);
if (failures.length) {
  for (const f of failures) console.error(`FAIL  ${f}`);
  console.error(`\n${failures.length} federation check(s) failed.`);
  process.exit(1);
}
console.log(`federation checks passed (Person @id ${expectedId}).`);
