// src/lib/api.ts

const API_BASE = 'https://api.rjmlaird.co.uk/api';

type ApiCollectionName =
  | 'awards'
  | 'education'
  | 'memberships'
  | 'volunteering'
  | 'certifications'
  | 'experience'
  | 'profile'
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

export function getAwards<T>() {
  return fetchJson<T>('awards');
}

export function getEducation<T>() {
  return fetchJson<T>('education');
}

export function getMemberships<T>() {
  return fetchJson<T>('memberships');
}

export function getVolunteering<T>() {
  return fetchJson<T>('volunteering');
}

export function getCertifications<T>() {
  return fetchJson<T>('certifications');
}

export function getExperience<T>() {
  return fetchJson<T>('experience');
}

export function getProfile<T>() {
  return fetchJson<T>('profile');
}

export function getLanguages<T>() {
  return fetchJson<T>('languages');
}

export function getSkills<T>() {
  return fetchJson<T>('skills');
}
