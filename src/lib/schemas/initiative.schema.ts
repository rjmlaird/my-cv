import { z } from "zod";

export const initiativeSchema = z.object({
  title: z.string(),

  description: z.string(),

  status: z.enum([
    "Active",
    "Planning",
    "Completed",
  ]),

  organisation: z.string(),

  website: z.string().url().optional(),

  impacts: z.array(z.string()).default([]),
});

export type Initiative = z.infer<typeof initiativeSchema>;