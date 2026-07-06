import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string(),

  description: z.string(),

  category: z.string(),

  deliverables: z.array(z.string()).default([]),

  pricingModel: z.enum([
    "fixed",
    "retainer",
    "hourly",
    "project-based",
  ]).optional(),

  featured: z.boolean().default(false),
});

export type Service = z.infer<typeof serviceSchema>;