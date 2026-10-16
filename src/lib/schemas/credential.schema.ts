import { z } from "zod";

export const credentialItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  /** Issuing organisation (registry slug). */
  organisationSlug: z.string(),
  cdnId: z.string().optional(),
});

export const credentialsSchema = z.object({
  credentials: z.array(credentialItemSchema).default([]),
});

export type CredentialItem = z.infer<typeof credentialItemSchema>;
export type Credentials = z.infer<typeof credentialsSchema>;
