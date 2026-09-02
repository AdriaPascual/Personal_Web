export interface Skill {
  name: string;
  category: string;
  level: number;
}

export interface Profile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  profileImageUrl: string;
  socialLinks: { github: string; linkedin: string };
  skills: Skill[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  createdDate: string;
  isFeatured: boolean;
}

export interface ExperienceItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExperienceData {
  experience: ExperienceItem[];
  education: EducationItem[];
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
}

export type BuildingType = 'about' | 'cv' | 'projects' | 'contact' | 'github' | 'linkedin' | 'unlimioo' | 'articles' | 'languages';
export type ModalBuildingType = Extract<BuildingType, 'about' | 'cv' | 'projects' | 'contact' | 'github' | 'languages'>;
