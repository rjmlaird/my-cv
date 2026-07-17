import type { Profile } from "@/lib/api";
import type { ExperienceItem } from "@/lib/schemas/experience.schema";
import type { EducationItem } from "@/lib/schemas/education.schema";
import type { CertificationItem } from "@/lib/schemas/certification.schema";
import type { MembershipGroup } from "@/lib/schemas/membership.schema";
import type { AwardItem } from "@/lib/schemas/award.schema";
import type { LanguageItem } from "@/lib/schemas/languages.schema";
import type { Social } from "@/lib/schemas/social.schema";
import { toISODate } from "@/lib/format";

export interface StructuredDataInput {
  siteUrl: string;
  ogImageUrl: string;
  profile: Profile | null;
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  memberships: MembershipGroup[];
  awards: AwardItem[];
  languages: LanguageItem[];
  socials: Social[];
  skillLabels: string[];
}

const orgName = (org: ExperienceItem["organisation"]): string | undefined =>
  typeof org === "string" ? org : org?.name ?? undefined;

const dedupe = (values: Array<string | undefined>): string[] =>
  Array.from(new Set(values.filter((v): v is string => Boolean(v && v.trim()))));

/**
 * Builds a single schema.org @graph — Person, WebSite and ProfilePage,
 * cross-linked by @id — sourced from the live CV API rather than
 * hardcoded, so it stays in sync with the visible page content.
 */
export function buildStructuredData(input: StructuredDataInput) {
  const {
    siteUrl,
    ogImageUrl,
    profile,
    experience,
    education,
    certifications,
    memberships,
    awards,
    languages,
    socials,
    skillLabels,
  } = input;

  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${siteUrl}/#webpage`;

  const name = profile?.name ?? "Ryan Laird";
  const description =
    profile?.headline ??
    profile?.summary?.[0] ??
    "Chartered Marketer specialising in sustainable marketing for the space sector.";

  // Current (or most recent) role drives jobTitle + worksFor.
  const sortedExperience = [...experience].sort(
    (a, b) => new Date(b.startDate ?? 0).getTime() - new Date(a.startDate ?? 0).getTime(),
  );
  const currentRole = sortedExperience.find((r) => r.current) ?? sortedExperience[0];
  const jobTitle = profile?.role ?? currentRole?.role ?? "Director, Green Orbit Digital";
  const currentOrgName = orgName(currentRole?.organisation) ?? "Green Orbit Digital";

  // schema.org's `worksFor` accepts multiple values — lead with the
  // current employer, followed by past employers, so the full work
  // graph is visible without overstating who Ryan currently works for.
  const employerNames = dedupe([currentOrgName, ...experience.map((r) => orgName(r.organisation))]);
  const worksFor = employerNames.map((n) => ({
    "@type": "Organization",
    name: n,
    ...(n === "Green Orbit Digital" ? { url: "https://greenorbit.space" } : {}),
  }));

  const alumniOf = education
    .filter((e) => e.institution)
    .map((e) => ({
      "@type": "CollegeOrUniversity",
      name: e.institution,
      ...(e.field ? { department: e.field } : {}),
    }));

  const memberOf = dedupe(
    memberships.flatMap((group) => group.items.map((i) => i.organisation)),
  ).map((n) => ({ "@type": "Organization", name: n }));

  const hasCredential = certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.name,
    ...(c.level ? { credentialCategory: c.level } : {}),
    ...(c.issuer ? { recognizedBy: { "@type": "Organization", name: c.issuer } } : {}),
    ...(c.issueDate ? { dateCreated: toISODate(c.issueDate) } : {}),
    ...(c.expiryDate ? { expires: toISODate(c.expiryDate) } : {}),
    ...(c.badgeUrl ? { url: c.badgeUrl } : {}),
  }));

  const awardNames = dedupe(
    awards.map((a) =>
      [a.title, Array.isArray(a.issuer) ? a.issuer.join(", ") : a.issuer, a.year ? String(a.year) : undefined]
        .filter(Boolean)
        .join(" — "),
    ),
  );

  const knowsLanguage = languages.map((l) => ({
    "@type": "Language",
    name: l.name,
  }));

  const sameAs = dedupe([
    ...socials.map((s) => s.url),
    "https://linkedin.com/in/rjmlaird87",
    "https://github.com/rjmlaird",
    "https://x.com/rjmlaird",
    "https://orcid.org/0000-0002-5992-684X",
  ]);

  const knowsAbout = dedupe([...(profile?.tags ?? []), ...skillLabels]).slice(0, 40);

  const person = {
    "@type": "Person",
    "@id": personId,
    name,
    ...(profile?.preferredName ? { alternateName: profile.preferredName } : {}),
    jobTitle,
    description,
    url: `${siteUrl}/`,
    image: ogImageUrl,
    email: profile?.email ? `mailto:${profile.email}` : "mailto:rjmlaird@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: profile?.location ?? "Leicester",
      addressCountry: "GB",
    },
    sameAs,
    worksFor,
    ...(alumniOf.length ? { alumniOf } : {}),
    ...(memberOf.length ? { memberOf } : {}),
    ...(hasCredential.length ? { hasCredential } : {}),
    ...(awardNames.length ? { award: awardNames } : {}),
    ...(knowsLanguage.length ? { knowsLanguage } : {}),
    ...(knowsAbout.length ? { knowsAbout } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${siteUrl}/`,
    name: "Ryan Laird — CV",
    inLanguage: "en-GB",
    publisher: { "@id": personId },
  };

  const webpage = {
    "@type": "ProfilePage",
    "@id": webpageId,
    url: `${siteUrl}/`,
    name: `${name} — CV`,
    description,
    inLanguage: "en-GB",
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    mainEntity: { "@id": personId },
    primaryImageOfPage: ogImageUrl,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [website, webpage, person],
  };
}
