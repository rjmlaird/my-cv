import type { Profile } from "@/lib/api";
import type { ExperienceItem } from "@/lib/schemas/experience.schema";
import type { Social } from "@/lib/schemas/social.schema";
import { buildSameAs } from "@/lib/sameAs";
import {
  CANONICAL_SITE_URL,
  CANONICAL_WEBSITE_ID,
  CORE_PROFILE_URLS,
  CV_FIRST_PUBLISHED,
  CV_WEBPAGE_ID,
  CV_WEBSITE_ID,
  PERSON_ID,
  PRIMARY_EMPLOYER,
  SITE_URL,
} from "@/config/site";

export interface StructuredDataInput {
  profile: Profile | null;
  experience: ExperienceItem[];
  socials: Social[];
  /** Absolute URL of the 1200x630 social preview image. */
  ogImageUrl: string;
  /** Absolute URL of a square portrait, if one is available. Omitted from the Person if not. */
  avatarUrl?: string;
  /** ISO 8601 timestamp for ProfilePage `dateModified` (the build time). */
  dateModified: string;
}

/**
 * Builds the CV page's schema.org @graph.
 *
 * Identity model: rjmlaird.co.uk owns the canonical Person (full detail:
 * occupation history, credentials, awards, memberships, languages, knowsAbout).
 * This page emits a SLIM Person stub that shares the canonical @id, plus the
 * CV's own WebSite and ProfilePage, linked back to the main site. The stub is
 * deliberate: Google evaluates each page's JSON-LD on its own and does not
 * reliably resolve @ids across domains, so a ProfilePage needs a Person node
 * present on the page. It carries only what's needed, with no duplicated detail.
 *
 * The contact email is intentionally NOT emitted (it stays visible on the page).
 */
export function buildStructuredData(input: StructuredDataInput) {
  const { profile, experience, socials, ogImageUrl, avatarUrl, dateModified } = input;

  const name = profile?.name ?? "Ryan Laird";
  const description =
    profile?.headline ??
    profile?.summary?.[0] ??
    "Chartered Marketer specialising in sustainable marketing for the space sector.";

  const currentRole =
    experience.find((r) => r.current) ??
    [...experience].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
  const jobTitle = profile?.role ?? currentRole?.role ?? `Director, ${PRIMARY_EMPLOYER.name}`;

  const sameAs = buildSameAs(
    [...socials.map((s) => s.url), ...CORE_PROFILE_URLS, CANONICAL_SITE_URL, SITE_URL],
    [], // Person.url is the canonical site; keeping it (and this CV) in sameAs is deliberate reciprocity.
  );

  const person = {
    "@type": "Person",
    "@id": PERSON_ID,
    name,
    ...(profile?.preferredName ? { alternateName: profile.preferredName } : {}),
    url: `${CANONICAL_SITE_URL}/`,
    jobTitle,
    ...(avatarUrl ? { image: avatarUrl } : {}),
    // Current employer only. Past roles (hasOccupation) live on the canonical Person.
    worksFor: { "@type": "Organization", name: PRIMARY_EMPLOYER.name, url: PRIMARY_EMPLOYER.url },
    address: {
      "@type": "PostalAddress",
      ...(profile?.location ? { addressLocality: profile.location.split(",")[0].trim() } : {}),
      addressCountry: "GB",
    },
    sameAs,
  };

  const website = {
    "@type": "WebSite",
    "@id": CV_WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: "Ryan Laird — CV",
    inLanguage: "en-GB",
    isPartOf: { "@id": CANONICAL_WEBSITE_ID },
    publisher: { "@id": PERSON_ID },
  };

  const webpage = {
    "@type": "ProfilePage",
    "@id": CV_WEBPAGE_ID,
    url: `${SITE_URL}/`,
    name: `${name} — CV`,
    description,
    inLanguage: "en-GB",
    dateCreated: CV_FIRST_PUBLISHED ?? dateModified,
    dateModified,
    isPartOf: { "@id": CV_WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: { "@id": PERSON_ID },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [website, webpage, person],
  };
}
