import { z } from 'astro/zod';

import { experienceItemSchema, type ExperienceItem } from '@/lib/schemas/experience.schema';
import { educationItemSchema, type EducationItem } from '@/lib/schemas/education.schema';
import { skillItemSchema, type SkillItem } from '@/lib/schemas/skill.schema';
import { certificationItemSchema, type CertificationItem } from '@/lib/schemas/certification.schema';
import { membershipItemSchema, type MembershipItem } from '@/lib/schemas/membership.schema';
import { awardItemSchema, type AwardItem } from '@/lib/schemas/award.schema';
import { languageItemSchema, type LanguageItem } from '@/lib/schemas/languages.schema';

const API_BASE = 'https://api.rjmlaird.co.uk/api';

type ApiCollectionName =
  | 'awards'
  | 'education'
  | 'memberships'
  | 'certifications'
  | 'experience'
  | 'languages'
  | 'skills';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/${path}`, {
    headers: { accept: '*/*' },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export function getCollection<T>(collection: ApiCollectionName) {
  return fetchJson<T>(collection);
}

const experienceResponseSchema = z.array(experienceItemSchema);
const educationResponseSchema = z.array(educationItemSchema);
const skillsResponseSchema = z.array(skillItemSchema);
const certificationsResponseSchema = z.array(certificationItemSchema);
const membershipsResponseSchema = z.array(membershipItemSchema);
const awardsResponseSchema = z.array(awardItemSchema);
const languagesResponseSchema = z.array(languageItemSchema);

export async function getExperience(): Promise<ExperienceItem[]> {
  return experienceResponseSchema.parse(await fetchJson<unknown>('experience'));
}

export async function getEducation(): Promise<EducationItem[]> {
  return educationResponseSchema.parse(await fetchJson<unknown>('education'));
}

export async function getSkills(): Promise<SkillItem[]> {
  return skillsResponseSchema.parse(await fetchJson<unknown>('skills'));
}

export async function getCertifications(): Promise<CertificationItem[]> {
  return certificationsResponseSchema.parse(await fetchJson<unknown>('certifications'));
}

export async function getMemberships(): Promise<MembershipItem[]> {
  return membershipsResponseSchema.parse(await fetchJson<unknown>('memberships'));
}

export async function getAwards(): Promise<AwardItem[]> {
  return awardsResponseSchema.parse(await fetchJson<unknown>('awards'));
}

export async function getLanguages(): Promise<LanguageItem[]> {
  return languagesResponseSchema.parse(await fetchJson<unknown>('languages'));
}
