import { z } from "zod";

export const certificationItemSchema = z.object({
  name: z.string(),

  issuer: z.string(),

  issuedDate: z.string(),

  expiryDate: z.string().optional(),

  credentialId: z.string().optional(),

  url: z.string().url().optional(),

  skills: z.array(z.string()).default([]),
});

export type CertificationItem = z.infer<typeof certificationItemSchema>;

export const certificationSchema = z.object({
  name: z.string(),

  issuer: z.string(),

  issuedDate: z.string(),

  expiryDate: z.string().optional(),

  credentialId: z.string().optional(),

  url: z.string().url().optional(),

  skills: z.array(z.string()).default([]),
});

export type Certification = z.infer<typeof certificationSchema>;