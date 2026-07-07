import { z } from "zod";

export const initiativeItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(["Active", "Planning", "Completed"]),
  organisation: z.string(),
  website: z.string().url().optional(),
  impacts: z.array(z.string()).default([]),
});

export type InitiativeItem = z.infer<typeof initiativeItemSchema>;
