import { z } from "zod";

export const educationSourceSchema = z.object({
  id: z.union([z.string(), z.number()]),
  institution: z.string(),
  role: z.string().optional(),
  qualification: z.string().optional(),
  field: z.string().optional(),
  institutionType: z.string().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  current: z.boolean().default(false),
  city: z.string().default(""),
  country: z.string().default(""),
  summary: z.string().default(""),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  clients: z.array(z.string()).default([]),
  articles: z.array(z.string()).default([]),
  talks: z.array(z.string()).default([]),
  awards: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  media: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const educationItemSchema = educationSourceSchema.transform((item) => ({
  id: String(item.id),
  institution: item.institution,
  role: item.role ?? item.qualification ?? "",
  qualification: item.qualification ?? item.role ?? "",
  field: item.field ?? "",
  institutionType: item.institutionType ?? "",
  startDate: item.startDate ?? null,
  endDate: item.current ? null : item.endDate ?? null,
  current: item.current,
  city: item.city,
  country: item.country,
  summary: item.summary,
  responsibilities: item.responsibilities,
  achievements: item.achievements,
  skills: item.skills,
  projects: item.projects,
  clients: item.clients,
  articles: item.articles,
  talks: item.talks,
  awards: item.awards,
  certifications: item.certifications,
  technologies: item.technologies,
  media: item.media,
  featured: item.featured,
  order: item.order,
}));

export const educationSchema = z.array(educationItemSchema).default([]);

export type EducationItem = z.infer<typeof educationItemSchema>;
export type Education = z.infer<typeof educationSchema>;
