import { z } from "zod";

export const educationSchema = z.object({
  institution: z.string(),

  qualification: z.string(),

  field: z.string(),

  startDate: z.string(),

  endDate: z.string().optional(),

  description: z.string().default(""),

  achievements: z.array(z.string()).default([]),
});

export type Education = z.infer<typeof educationSchema>;