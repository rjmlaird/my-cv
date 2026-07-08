import { z } from "zod";

/* Raw input schema matching your JSON */
export const rawEducationSchema = z.object({
  id: z.number(),
  date: z.string(), // e.g. "April 2023 - June 2023"
  title: z.string(),
  institution: z.string(),
  institutionType: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  display_text: z.string().optional(),
  description: z.string().default(""),
  skills: z.array(z.string()).default([]),
});

/* Cleaner internal schema you can use in the UI */
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

/* Type exports */
export type RawEducation = z.infer<typeof rawEducationSchema>;
export type Education = z.infer<typeof educationSchema>;

/* Helper: parse raw JSON, validate, and map into Education */
export function parseEducation(raw: unknown): Education {
  const parsed = rawEducationSchema.parse(raw);

  // Try to split date into start/end when possible
  const dateParts = parsed.date.split(" - ").map((s) => s.trim());
  const startDate = dateParts[0] ?? undefined;
  const endDate = dateParts[1] ?? undefined;

  const mapped: Education = {
    id: parsed.id,
    qualification: parsed.title,
    institution: parsed.institution,
    institutionType: parsed.institutionType,
    field: parsed.department, // department → field
    location: parsed.location,
    startDate,
    endDate,
    displayText: parsed.display_text ?? undefined,
    description: parsed.description ?? "",
    achievements: [], // keep empty by default; map skills later if desired
    skills: parsed.skills ?? [],
  };

  return educationSchema.parse(mapped);
}
