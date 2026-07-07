import { z } from "zod";

export const certificationLinkSchema = z.object({
  label: z.string(),
  href: z.string().url().optional(),
});

export const certificationSubgroupSchema = z.object({
  subhead: z.string(),
  items: z.array(certificationLinkSchema),
});

export const certificationGroupSchema = z.object({
  title: z.string(),
  items: z.array(certificationLinkSchema),
  subgroups: z.array(certificationSubgroupSchema).optional(),
});

export const certificationsResponseSchema = z.object({
  certifications: z.array(certificationGroupSchema),
});

export type CertificationLink = z.infer<typeof certificationLinkSchema>;
export type CertificationSubgroup = z.infer<typeof certificationSubgroupSchema>;
export type CertificationGroup = z.infer<typeof certificationGroupSchema>;
export type CertificationsResponse = z.infer<typeof certificationsResponseSchema>;
