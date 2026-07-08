import { z } from "astro/zod";

export const experienceModeSchema = z.enum([
  "agency",
  "company",
  "freelance",
  "programme",
  "non_profit",
  "network",
  "research",
  "university",
  "education",
  "government",
  "local_authority",
  "media",
  "consortium",
  "school",
  "internship",
  "outreach",
  "independent",
]);

export const employmentTypeSchema = z.enum([
  "founder",
  "employee",
  "contract",
  "freelance",
  "internship",
  "research",
  "academic",
  "career_break",
]);

export const workModeSchema = z.enum(["remote", "hybrid", "onsite"]);

export const experienceLinkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

export const organisationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: experienceModeSchema.optional(),
  website: z.string().url().optional(),
});

export const experienceImpactSchema = z.object({
  metric: z.string(),
  value: z.union([z.string(), z.number()]),
  context: z.string().optional(),
});

export const experienceMediaSchema = z.object({
  type: z.enum(["image", "video", "article"]),
  url: z.string().url(),
  caption: z.string().optional(),
});

export const locationSchema = z.preprocess((value) => {
  if (value && typeof value === "object") {
    const v = value as { city?: unknown; country?: unknown };
    const city = typeof v.city === "string" ? v.city : "";
    const country = typeof v.country === "string" ? v.country : "";
    return [city, country].filter(Boolean).join(", ");
  }

  return value;
}, z.string().default(""));

export const experienceItemSchema = z.object({
  id: z.string(),
  organisation: z.union([organisationSchema, z.string()]).default(""),
  role: z.string(),
  employmentType: employmentTypeSchema.catch("employee"),
  organisationType: experienceModeSchema.optional(),
  location: locationSchema,
  workMode: workModeSchema.catch("remote"),
  summary: z.string().default(""),
  responsibilities: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  links: z.array(experienceLinkSchema).default([]),
  organisationSlug: z.string().optional(),
  hubspotId: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  startDate: z.string().default(""),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().default(false),
  impact: z.array(experienceImpactSchema).default([]),
  media: z.array(experienceMediaSchema).default([]),
  order: z.number().int().optional(),
});

export const experienceResponseSchema = z.array(experienceItemSchema).default([]);

export type ExperienceMode = z.infer<typeof experienceModeSchema>;
export type EmploymentType = z.infer<typeof employmentTypeSchema>;
export type WorkMode = z.infer<typeof workModeSchema>;
export type ExperienceLink = z.infer<typeof experienceLinkSchema>;
export type Organisation = z.infer<typeof organisationSchema>;
export type ExperienceImpact = z.infer<typeof experienceImpactSchema>;
export type ExperienceMedia = z.infer<typeof experienceMediaSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type ExperienceResponse = z.infer<typeof experienceResponseSchema>;
