import { z } from "zod";
import { awardItemSchema } from "@/lib/schemas/award.schema";
import { certificationItemSchema } from "@/lib/schemas/certification.schema";
import { credentialItemSchema } from "@/lib/schemas/credential.schema";
import { educationItemSchema } from "@/lib/schemas/education.schema";
import { experienceItemSchema } from "@/lib/schemas/experience.schema";
import { languageItemSchema } from "@/lib/schemas/languages.schema";
import { membershipsSchema } from "@/lib/schemas/membership.schema";
import { profileSchema } from "@/lib/schemas/profile.schema";
import { projectSchema } from "@/lib/schemas/project.schema";
import { socialSchema } from "@/lib/schemas/social.schema";
import { ToolDataSchema } from "@/lib/schemas/tool.schema";
import { volunteeringItemSchema } from "@/lib/schemas/volunteering.schema";
import {
  buildOrganisationIndex,
  type OrganisationIndex,
  type Resolved,
} from "@/lib/organisations";

export type Profile = z.infer<typeof profileSchema>;

export const organisationItemSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().nullable().optional(),
  aliases: z.array(z.string()).default([]),
  legacySlugs: z.array(z.string()).default([]),
  kind: z.string().default("other"),
  sectors: z.array(z.string()).default([]),
  relationships: z.array(z.string()).default([]),
  url: z.string().nullable().optional(),
  hubspotId: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  featured: z.boolean().default(false),
});

export const organisationsSchema = z.array(organisationItemSchema);

export type OrganisationItem = z.infer<typeof organisationItemSchema>;

const API_ROOT = process.env.CV_API_BASE ?? "https://api.rjmlaird.co.uk/v1";

const CV_API_BASE = `${API_ROOT}/cv`;
const PORTFOLIO_API_BASE = `${API_ROOT}/portfolio`;
const BIO_URL = `${API_ROOT}/bio`;

const MANIFEST_URL =
  "https://pub-2bd99ffbe3b44222ae5b1b9c3482209f.r2.dev/manifest.json";

const FETCH_TIMEOUT_MS = 15_000;
const FETCH_RETRIES = 1;
const ALLOW_PARTIAL = process.env.ALLOW_PARTIAL === "1";

function critical(label: string, detail: unknown): void {
  const message =
    `[API] CRITICAL: ${label} unavailable or invalid. ` +
    "Refusing to build a partial CV (set ALLOW_PARTIAL=1 to override).";

  console.error(message, detail ?? "");

  if (!ALLOW_PARTIAL) {
    throw new Error(message);
  }
}

async function fetchOnce(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");

    throw new Error(
      `HTTP ${response.status} ${response.statusText}: ${body.slice(0, 500)}`,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const body = await response.text().catch(() => "");

    throw new Error(
      `Expected JSON but received "${contentType || "unknown content type"}": ` +
        body.slice(0, 500),
    );
  }

  return response.json();
}

const requestCache = new Map<string, Promise<unknown | null>>();

function fetchJson<T>(url: string, isFullUrl = false): Promise<T | null> {
  const fullUrl = isFullUrl ? url : `${CV_API_BASE}/${url}`;
  const cached = requestCache.get(fullUrl);

  if (cached) {
    return cached as Promise<T | null>;
  }

  const request = (async (): Promise<unknown | null> => {
    let lastError: unknown;

    for (let attempt = 0; attempt <= FETCH_RETRIES; attempt += 1) {
      try {
        return await fetchOnce(fullUrl);
      } catch (error) {
        lastError = error;
      }
    }

    console.error(`[API] Failed to fetch ${fullUrl}:`, lastError);
    return null;
  })();

  requestCache.set(fullUrl, request);

  return request as Promise<T | null>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrap(data: unknown, key?: string): unknown {
  let value = data;

  if (isRecord(value) && "data" in value) {
    value = value.data;
  }

  if (key && isRecord(value) && key in value) {
    value = value[key];
  }

  return value;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normaliseLocation(value: unknown): string | undefined {
  if (typeof value === "string") {
    return readString(value);
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const city = readString(value.city);
  const country = readString(value.country);

  return [city, country].filter(Boolean).join(", ") || undefined;
}

function normaliseStringArray(value: unknown): string[] {
  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normaliseProfile(value: unknown): unknown {
  if (!isRecord(value)) {
    return value;
  }

  return {
    ...value,
    name: readString(value.name) ?? readString(value.displayName),
    location: normaliseLocation(value.location),
    summary: normaliseStringArray(value.summary),
  };
}

async function getRequiredArray<T>(
  endpoint: string,
  key: string,
  label: string,
  itemSchema: z.ZodType<T>,
): Promise<T[]> {
  const data = await fetchJson<unknown>(endpoint);
  const root = unwrap(data, key);
  const result = z.array(itemSchema).safeParse(root);

  if (!result.success) {
    console.error(`[API] ${label} validation failed:`, {
      endpoint: `${CV_API_BASE}/${endpoint}`,
      received: data,
      extracted: root,
      issues: result.error.issues,
    });

    critical(label, result.error.issues);
    return [];
  }

  if (result.data.length === 0) {
    console.error(`[API] ${label} endpoint returned an empty array:`, {
      endpoint: `${CV_API_BASE}/${endpoint}`,
      received: data,
    });

    critical(label, "empty list");
    return [];
  }

  return result.data;
}

export async function getDocuments() {
  const data = await fetchJson<unknown>(MANIFEST_URL, true);
  return Array.isArray(data) ? data : [];
}

export async function getOrganisations(): Promise<OrganisationItem[]> {
  const data = await fetchJson<unknown>("organisations");
  const root = unwrap(data, "organisations");
  const result = organisationsSchema.safeParse(root);

  if (!result.success) {
    console.error("[API] Organisations validation failed:", {
      endpoint: `${CV_API_BASE}/organisations`,
      received: data,
      extracted: root,
      issues: result.error.issues,
    });

    return [];
  }

  const duplicateSlugs = new Set<string>();
  const knownSlugs = new Set<string>();
  const duplicateHubspotIds = new Set<string>();
  const knownHubspotIds = new Set<string>();

  for (const organisation of result.data) {
    for (const slug of [organisation.slug, ...organisation.legacySlugs]) {
      if (knownSlugs.has(slug)) {
        duplicateSlugs.add(slug);
      }

      knownSlugs.add(slug);
    }

    if (organisation.hubspotId) {
      if (knownHubspotIds.has(organisation.hubspotId)) {
        duplicateHubspotIds.add(organisation.hubspotId);
      }

      knownHubspotIds.add(organisation.hubspotId);
    }
  }

  if (duplicateSlugs.size > 0 || duplicateHubspotIds.size > 0) {
    console.warn("[API] Organisation registry has data issues:", {
      duplicateSlugs: [...duplicateSlugs],
      duplicateHubspotIds: [...duplicateHubspotIds],
    });
  }

  return result.data;
}

let organisationIndex: Promise<OrganisationIndex> | undefined;
const reportedMisses = new Set<string>();

export function getOrganisationIndex(): Promise<OrganisationIndex> {
  organisationIndex ??= getOrganisations().then((list) => {
    if (list.length === 0) {
      critical("Organisations", "registry empty or invalid");
    }

    return buildOrganisationIndex(list);
  });

  return organisationIndex;
}

function resolveOrganisation(
  index: OrganisationIndex,
  label: string,
  ref: {
    slug?: string | null;
    name?: string | null;
    id?: string;
  },
  strict = false,
): OrganisationItem {
  const found = index.lookup(ref.slug, ref.name);

  if (found) {
    return found;
  }

  if (ref.slug || ref.name) {
    const detail = {
      item: ref.id,
      slug: ref.slug,
      name: ref.name,
    };

    const key =
      `${label}|${ref.id ?? ""}|${ref.slug ?? ""}|${ref.name ?? ""}`;

    if (!reportedMisses.has(key)) {
      reportedMisses.add(key);
      console.error(`[API] ${label}: unknown organisation reference`, detail);
    }

    if (strict) {
      critical(`${label} organisation reference`, detail);
    }
  }

  return index.stub(ref.slug, ref.name);
}

type OrgRef = {
  id?: string;
  organisationSlug?: string | null;
  legacyOrganisationName?: string | null;
};

function withOrganisation<T extends OrgRef>(
  items: T[],
  index: OrganisationIndex,
  label: string,
  strict = false,
): Array<Resolved<T>> {
  return items.map((item) => ({
    ...item,
    organisation: resolveOrganisation(
      index,
      label,
      {
        slug: item.organisationSlug,
        name: item.legacyOrganisationName,
        id: item.id,
      },
      strict,
    ),
  }));
}

export async function getExperience() {
  const [items, index] = await Promise.all([
    getRequiredArray(
      "experience",
      "experience",
      "Experience",
      experienceItemSchema,
    ),
    getOrganisationIndex(),
  ]);

  return withOrganisation(items, index, "Experience");
}

export async function getEducation() {
  const [items, index] = await Promise.all([
    getRequiredArray("education", "education", "Education", educationItemSchema),
    getOrganisationIndex(),
  ]);

  return withOrganisation(items, index, "Education", true).map((item) => ({
    ...item,
    awardingBody: item.awardingBodySlug
      ? resolveOrganisation(index, "Education awarding body", {
          slug: item.awardingBodySlug,
          id: item.id,
        })
      : undefined,
  }));
}

export async function getLanguages() {
  const data = await fetchJson<unknown>("languages");
  const root = unwrap(data, "languages");
  const result = z.array(languageItemSchema).safeParse(root);

  if (!result.success) {
    console.error("[API] Languages validation failed:", {
      received: data,
      extracted: root,
      issues: result.error.issues,
    });
  }

  return result.success ? result.data : [];
}

export async function getVolunteering() {
  const data = await fetchJson<unknown>("volunteering");
  const root = unwrap(data, "volunteering");
  const result = z.array(volunteeringItemSchema).safeParse(root);

  if (!result.success) {
    console.error("[API] Volunteering validation failed:", {
      received: data,
      extracted: root,
      issues: result.error.issues,
    });

    return [];
  }

  return withOrganisation(
    result.data,
    await getOrganisationIndex(),
    "Volunteering",
  );
}

export async function getProjects() {
  const data = await fetchJson<unknown>(
    `${PORTFOLIO_API_BASE}/projects`,
    true,
  );

  const root = unwrap(data, "projects");
  const result = z.array(projectSchema).safeParse(root);

  if (!result.success) {
    console.error("[API] Projects validation failed:", {
      received: data,
      extracted: root,
      issues: result.error.issues,
    });
  }

  return result.success ? result.data : [];
}

export async function getSocials() {
  const data = await fetchJson<unknown>("socials");
  const root = unwrap(data, "socials");
  const result = z.array(socialSchema).safeParse(root);

  if (!result.success) {
    console.error("[API] Socials validation failed:", {
      received: data,
      extracted: root,
      issues: result.error.issues,
    });
  }

  return result.success ? result.data : [];
}

export async function getProfile(): Promise<Profile | null> {
  const data = await fetchJson<unknown>(BIO_URL, true);
  const root = unwrap(data);
  const profile = normaliseProfile(root);

  if (!profile) {
    critical("Profile", {
      endpoint: BIO_URL,
      reason: "no response",
    });

    return null;
  }

  const result = profileSchema.safeParse(profile);

  if (!result.success) {
    console.error("[API] Profile validation failed:", {
      endpoint: BIO_URL,
      received: data,
      extracted: root,
      normalised: profile,
      issues: result.error.issues,
    });

    critical("Profile", result.error.issues);
    return null;
  }

  return result.data;
}

export async function getCertifications() {
  const data = await fetchJson<unknown>("certifications");
  const root = unwrap(data, "certifications");
  const result = z.array(certificationItemSchema).safeParse(root);

  if (!result.success) {
    console.error("[API] Certifications validation failed:", {
      received: data,
      extracted: root,
      issues: result.error.issues,
    });

    return [];
  }

  return withOrganisation(
    result.data,
    await getOrganisationIndex(),
    "Certifications",
  );
}

export async function getCredentials() {
  const data = await fetchJson<unknown>("credentials");
  const root = unwrap(data, "credentials");
  const result = z.array(credentialItemSchema).safeParse(root);

  if (!result.success) {
    console.error("[API] Credentials validation failed:", {
      received: data,
      extracted: root,
      issues: result.error.issues,
    });

    return [];
  }

  return withOrganisation(
    result.data,
    await getOrganisationIndex(),
    "Credentials",
  );
}

export async function getMemberships() {
  const data = await fetchJson<unknown>("memberships");
  const root = unwrap(data, "memberships");

  const result = membershipsSchema.safeParse(
    Array.isArray(root) ? { memberships: root } : root,
  );

  if (!result.success) {
    console.error("[API] Memberships validation failed:", {
      received: data,
      extracted: root,
      issues: result.error.issues,
    });

    return [];
  }

  const index = await getOrganisationIndex();

  return result.data.memberships.map((group) => ({
    title: group.title,
    items: group.items.map((item) => ({
      role: item.role,
      organisation: resolveOrganisation(index, "Memberships", {
        slug: item.organisationSlug,
      }),
    })),
  }));
}

export async function getAwards() {
  const data = await fetchJson<unknown>("awards");
  const root = unwrap(data, "awards");
  const result = z.array(awardItemSchema).safeParse(root);

  if (!result.success) {
    console.error("[API] Awards validation failed:", {
      received: data,
      extracted: root,
      issues: result.error.issues,
    });

    return [];
  }

  const index = await getOrganisationIndex();

  return result.data.map(
    ({
      organisationSlug,
      additionalOrganisationSlugs,
      clientOrganisationSlug,
      ...award
    }) => ({
      ...award,
      organisation: resolveOrganisation(index, "Awards", {
        slug: organisationSlug,
        id: award.id,
      }),
      additionalOrganisations: additionalOrganisationSlugs.map((slug) =>
        resolveOrganisation(index, "Awards", {
          slug,
          id: award.id,
        }),
      ),
      clientOrganisation: clientOrganisationSlug
        ? resolveOrganisation(index, "Awards", {
            slug: clientOrganisationSlug,
            id: award.id,
          })
        : undefined,
    }),
  );
}

export async function getTools() {
  const data = await fetchJson<unknown>("tools");
  const root = unwrap(data, "tools");

  if (!root) {
    return { categories: [] };
  }

  const result = ToolDataSchema.safeParse(root);

  if (!result.success) {
    console.error("[API] Tools validation failed:", {
      received: data,
      extracted: root,
      issues: result.error.issues,
    });
  }

  return result.success ? result.data : { categories: [] };
}

export type ResolvedExperience =
  Awaited<ReturnType<typeof getExperience>>[number];

export type ResolvedEducation =
  Awaited<ReturnType<typeof getEducation>>[number];

export type ResolvedVolunteering =
  Awaited<ReturnType<typeof getVolunteering>>[number];

export type ResolvedCertification =
  Awaited<ReturnType<typeof getCertifications>>[number];

export type ResolvedAward = Awaited<ReturnType<typeof getAwards>>[number];

export type ResolvedMembershipGroup =
  Awaited<ReturnType<typeof getMemberships>>[number];

const api = {
  getDocuments,
  getExperience,
  getEducation,
  getCertifications,
  getCredentials,
  getMemberships,
  getAwards,
  getLanguages,
  getProfile,
  getOrganisations,
  getOrganisationIndex,
  getVolunteering,
  getProjects,
  getSocials,
  getTools,
};

export default api;
