import { z } from "zod";

export const awardItemSchema = z.object({
  title: z.string(),
  issuer: z.string(),
  date: z.string(),
  description: z.string().default(""),
  category: z.string().optional(),
  url: z.string().url().optional(),
  featured: z.boolean().default(false),
});

export type AwardItem = z.infer<typeof awardItemSchema>;
