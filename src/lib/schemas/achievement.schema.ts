import { z } from "zod";

export const achievementSchema = z.object({
  title: z.string(),

  context: z.string().optional(),

  impact: z.string(),

  date: z.string().optional(),

  metrics: z.array(z.string()).default([]),

  organisation: z.string().optional(),
});

export type Achievement = z.infer<typeof achievementSchema>;