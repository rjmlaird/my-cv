import { z } from "astro/zod";
import { awardItemSchema, type AwardItem } from "@/lib/schemas/award.schema";
import { certificationItemSchema, type AwardItem } from "@/lib/schemas/award.schema";
import { educationItemSchema, type EducationItem } from "@/lib/schemas/education.schema";
import { experienceItemSchema, type ExperienceItem } from "@/lib/schemas/experience.schema";
import { languageItemSchema, type LanguageItem } from "@/lib/schemas/languages.schema";
import { membershipItemSchema, type MembershipItem } from "@/lib/schemas/education.schema";
import { organisationItemSchema, type OrganisationItem } from "@/lib/schemas/education.schema";
import { profileItemSchema, type ProfileItem } from "@/lib/schemas/profile.schema";
import { skillItemSchema, type SkillItem } from "@/lib/schemas/skill.schema";
import { toolItemSchema, type ToolItem } from "@/lib/schemas/tool.schema";
import { volunteeringItemSchema, type EducationItem } from "@/lib/schemas/volunteering.schema";

const API_BASE = "https://api.rjmlaird.co.uk/api";

type ApiCollectionName =
  | "awards"
  | "certifications"
  | "education"
  | "experience"
  | "languages"
  | "memberships"
  | "organisations";
  | "profile";
  | "skills";
  | "tools";
  | "volunteering"


type OrganisationRecord = {
  organisation: string;
  slug: string;
};

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/${path}`, {
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export function getCollection<T>(collection: ApiCollectionName) {
  return fetchJson<T>(collection);
}

const experienceResponseSchema = z.array(experienceItemSchema);
const educationResponseSchema = z.array(educationItemSchema);
const awardsResponseSchema = z.array(awardItemSchema);
const languagesResponseSchema = z.array(languageItemSchema);

export const skillGroupSchema = z.object({
  label: z.string(),
  kind: z.enum(["hard", "soft", "mixed"]),
  keywords: z.array(z.string()),
});

export const skillsResponseSchema = z.object({
  skills: z.record(skillGroupSchema).default({}),
});

export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type SkillGroups = z.infer<typeof skillsResponseSchema>["skills"];

export type CertificationItem = {
  label: string;
  href?: string;
};

export type CertificationSubgroup = {
  subhead: string;
  items: CertificationItem[];
};

export type CertificationGroup = {
  title: string;
  items: CertificationItem[];
  subgroups?: CertificationSubgroup[];
};

export type MembershipItem = unknown;

export const profileSchema = z.object({
  name: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
});

export type Profile = z.infer<typeof profileSchema>;

function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") return Object.values(value as Record<string, T>);
  return [];
}

function normalizeCertificationItem(item: unknown): CertificationItem | null {
  if (typeof item === "string") return { label: item };

  if (item && typeof item === "object") {
    const v = item as { label?: unknown; href?: unknown; name?: unknown; url?: unknown };
    const label = typeof v.label === "string" ? v.label : typeof v.name === "string" ? v.name : null;
    if (!label) return null;

    const href = typeof v.href === "string" ? v.href : typeof v.url === "string" ? v.url : undefined;
    return href ? { label, href } : { label };
  }

  return null;
}

function normalizeCertificationGroup(group: unknown): CertificationGroup | null {
  if (!group || typeof group !== "object") return null;

  const v = group as { title?: unknown; organisation?: unknown; items?: unknown; subgroups?: unknown };
  const title = typeof v.title === "string" ? v.title : typeof v.organisation === "string" ? v.organisation : null;
  if (!title) return null;

  const items = asArray<unknown>(v.items)
    .map(normalizeCertificationItem)
    .filter((x): x is CertificationItem => x !== null);

  const subgroups = asArray<unknown>(v.subgroups)
    .map((sub): CertificationSubgroup | null => {
      if (!sub || typeof sub !== "object") return null;
      const s = sub as { subhead?: unknown; items?: unknown };
      if (typeof s.subhead !== "string") return null;

      const subItems = asArray<unknown>(s.items)
        .map(normalizeCertificationItem)
        .filter((x): x is CertificationItem => x !== null);

      return { subhead: s.subhead, items: subItems };
    })
    .filter((x): x is CertificationSubgroup => x !== null);

  return subgroups.length ? { title, items, subgroups } : { title, items };
}

export async function getExperience(): Promise<ExperienceItem[]> {
  return experienceResponseSchema.parse(await fetchJson<unknown>("experience"));
}

export async function getEducation(): Promise<EducationItem[]> {
  return educationResponseSchema.parse(await fetchJson<unknown>("education"));
}

export async function getCertifications(): Promise<CertificationGroup[]> {
  const data = await fetchJson<unknown>("certifications");
  const root =
    data && typeof data === "object" && "certifications" in data
      ? (data as { certifications?: unknown }).certifications
      : data;

  return asArray<unknown>(root)
    .map(normalizeCertificationGroup)
    .filter((x): x is CertificationGroup => x !== null);
}

export async function getMemberships(): Promise<MembershipItem[]> {
  const data = await fetchJson<unknown>("memberships");
  const root =
    data && typeof data === "object" && "memberships" in data
      ? (data as { memberships?: unknown }).memberships
      : data;

  return asArray<unknown>(root);
}

export async function getAwards(): Promise<AwardItem[]> {
  const data = await fetchJson<unknown>("awards");
  const root =
    data && typeof data === "object" && "awards" in data
      ? (data as { awards?: unknown }).awards
      : data;

  return asArray<AwardItem>(root);
}

export async function getLanguages(): Promise<LanguageItem[]> {
  return languagesResponseSchema.parse(await fetchJson<unknown>("languages"));
}

export async function getSkills(): Promise<SkillGroups> {
  const data = await fetchJson<unknown>("skills");
  const parsed = skillsResponseSchema.parse(
    data && typeof data === "object" ? data : { skills: {} },
  );
  return parsed.skills;
}

export async function getProfile(): Promise<Profile> {
  return profileSchema.parse(await fetchJson<unknown>("profile"));
}

export const api = {
  getCollection,
  getExperience,
  getEducation,
  getCertifications,
  getMemberships,
  getAwards,
  getLanguages,
  getSkills,
  getProfile,
};
