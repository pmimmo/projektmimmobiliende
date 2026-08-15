import sealsData from './seals.json';

export interface CertificationMeta {
  title: string;
  desc: string;
  link?: string;
  holder?: string;
  issuer?: string;
  category?: string;
  belongsTo?: string[];
}

export const CERTIFICATIONS = sealsData as Record<string, CertificationMeta>;

export type CertificationId = keyof typeof CERTIFICATIONS;

export function getCertification(id: string | undefined): CertificationMeta | undefined {
  return id ? CERTIFICATIONS[id] : undefined;
}

