import { z } from "zod";

export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  issuer: z.string(),
  issueDate: z.string().nullable().optional(),
  badgeId: z.string().optional(),
  badgeUrl: z.string().url().optional(),
  expiryDate: z.string().nullable().optional(),
  level: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  url: z.string().url().optional(),
});

export const certificationsSchema = z.object({
  certifications: z.array(certificationItemSchema).default([]),
});
