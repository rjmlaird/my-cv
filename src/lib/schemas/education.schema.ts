import { z } from "zod";

export const educationItemSchema = z.object({
  institution: z.string(),
  qualification: z.string().optional().default(""),
  field: z.string().optional().default(""),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional(),
  description: z.string().default(""),
  achievements: z.array(z.string()).default([]),
});

export type EducationItem = z.infer<typeof educationItemSchema>;
