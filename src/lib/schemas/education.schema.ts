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
  city: z.string(),
  country: z.string(),
  summary: z.string().default(""),
  responsibilities: z.array(z.string()).default([]),
  keyActivities: z.array(z.string()).default([]), // Added this field
  achievements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  clients: z.array(z.string()).default([]),
  articles: z.array(z.string()).default([]),
  talks: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  media: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  relatedAwards: z.array(z.string()).default([]),
  relatedCertifications: z.array(z.string()).default([]),
  relatedExperience: z.array(z.string()).default([]),
  relatedEducation: z.array(z.string()).default([]),
  relatedVolunteering: z.array(z.string()).default([]),
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
  keyActivities: item.keyActivities, // Transformed field
  achievements: item.achievements,
  skills: item.skills,
  projects: item.projects,
  clients: item.clients,
  articles: item.articles,
  talks: item.talks,
  technologies: item.technologies,
  media: item.media,
  featured: item.featured,
  order: item.order,
  relatedAwards: item.relatedAwards,
  relatedCertifications: item.relatedCertifications,
  relatedExperience: item.relatedExperience,
  relatedEducation: item.relatedEducation,
  relatedVolunteering: item.relatedVolunteering,
}));

export const educationSchema = z.array(educationItemSchema).default([]);

export type EducationItem = z.infer<typeof educationItemSchema>;
export type Education = z.infer<typeof educationSchema>;