import { z } from "zod";

export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  /** Issuing organisation (registry slug). */
  organisationSlug: z.string(),
  issueDate: z.string().nullable().optional(),
  badgeId: z.string().optional(),
  badgeUrl: z.url().optional(),
  expiryDate: z.string().nullable().optional(),
  level: z.string().nullable().optional(),

  // This is the ID you pass to getCdnUrl()
  cdnId: z.string().optional(),
  
  imageUrl: z.url().nullable().optional(),
  
  relatedExperience: z.array(z.string()).default([]),
  relatedEducation: z.array(z.string()).default([]),
  relatedVolunteering: z.array(z.string()).default([]),
  relatedMemberships: z.array(z.string()).default([]),
  relatedOrg: z.array(z.string()).default([]),
});

export const certificationsSchema = z.object({
  certifications: z.array(certificationItemSchema).default([]),
});

export type CertificationItem = z.infer<typeof certificationItemSchema>;
export type Certifications = z.infer<typeof certificationsSchema>;
