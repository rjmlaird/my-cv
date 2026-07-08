import { z } from "astro/zod";

export const educationItemSchema = z.object({
  id: z.number(),
  date: z.string(),
  title: z.string(),
  institution: z.string(),
  institutionType: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  display_text: z.string().optional(),
  description: z.string().default(""),
  skills: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  id: z.number(),
  qualification: z.string(),
  institution: z.string(),
  institutionType: z.string().optional(),
  field: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  displayText: z.string().optional(),
  description: z.string().default(""),
  achievements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
});

export type EducationItem = z.infer<typeof educationItemSchema>;
export type Education = z.infer<typeof educationSchema>;

export function parseEducation(raw: unknown): Education {
  const item = educationItemSchema.parse(raw);
  const [startDate, endDate] = item.date.split(" - ").map((part) => part.trim());

  return educationSchema.parse({
    id: item.id,
    qualification: item.title,
    institution: item.institution,
    institutionType: item.institutionType,
    field: item.department,
    location: item.location,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    displayText: item.display_text,
    description: item.description,
    achievements: [],
    skills: item.skills,
  });
}
