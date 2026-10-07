/**
 * Single source of truth for site identity.
 *
 * rjmlaird.co.uk (the apex) OWNS the canonical Person node. This CV site only
 * references it by @id and emits a slim stub (see src/lib/structuredData.ts).
 * Do not hardcode any of these values elsewhere.
 */

/** Origin of this site. Keep in sync with `site` in astro.config.mjs. */
export const SITE_URL = "https://cv.rjmlaird.co.uk";

/** Origin of the main site that owns the canonical identity. */
export const CANONICAL_SITE_URL = "https://rjmlaird.co.uk";

/** Canonical schema.org @ids, owned and defined in full by the main site. */
export const PERSON_ID = `${CANONICAL_SITE_URL}/#person`;
export const CANONICAL_WEBSITE_ID = `${CANONICAL_SITE_URL}/#website`;

/** @ids owned by this site. */
export const CV_WEBSITE_ID = `${SITE_URL}/#website`;
export const CV_WEBPAGE_ID = `${SITE_URL}/#webpage`;

/**
 * Current employer for schema `worksFor`. Pinned deliberately (not derived from
 * the experience list) until the Green Orbit / Impact Orbit question is settled.
 */
export const PRIMARY_EMPLOYER = {
  name: "Green Orbit Digital",
  url: "https://greenorbit.space",
} as const;

/** Shown on the page. Intentionally NOT emitted in JSON-LD. */
export const CONTACT_EMAIL = "rjmlaird@gmail.com";

/**
 * ISO date the CV was first published. Used for ProfilePage `dateCreated`.
 * TODO(ryan): set the real date. Until then dateCreated falls back to the build date.
 */
export const CV_FIRST_PUBLISHED: string | undefined = undefined;

/** Identity profiles always included in `sameAs` (deduped against the API socials). */
export const CORE_PROFILE_URLS = [
  "https://linkedin.com/in/rjmlaird87",
  "https://github.com/rjmlaird",
  "https://x.com/rjmlaird",
  "https://orcid.org/0000-0002-5992-684X",
] as const;
