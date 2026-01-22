export enum DocumentType {
  RESUME = 'RESUME',
  ACADEMIC_CV = 'ACADEMIC_CV'
}

export enum TemplateType {
  MODERN = 'MODERN',
  CLASSIC = 'CLASSIC',
  MINIMAL = 'MINIMAL',
  CREATIVE = 'CREATIVE'
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string; // Bullet points
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  graduationDate: string;
  details?: string; // Thesis title, etc. (More relevant for CV)
}

export interface Project {
  id: string;
  name: string;
  role: string;
  link?: string;
  description: string;
}

export interface Publication {
  id: string;
  citation: string;
  link?: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  contact: string;
}

export interface PhotoConfig {
  shape: 'circle' | 'square' | 'rounded';
  size: number; // in pixels
  border: boolean;
  grayscale: boolean;
}

export interface NameConfig {
  size: number; // in pixels
  bold: boolean;
  uppercase: boolean;
  align: 'left' | 'center' | 'right';
}

export interface ResumeData {
  // Personal Info
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  photoUrl?: string;
  photoConfig: PhotoConfig;
  nameConfig: NameConfig;

  // Content
  summary: string;
  skills: string[]; // Hard & Soft mixed for simplicity, or could be separated
  languages: string[];
  
  // Collections
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  
  // CV Specifics
  publications: Publication[];
  awards: string[];
  researchInterests: string[];
  references: Reference[];
  memberships: string[];
}

export interface AppState {
  docType: DocumentType;
  template: TemplateType;
  themeColor: string;
  data: ResumeData;
  scale: number;
}