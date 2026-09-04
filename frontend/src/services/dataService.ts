import { getLocale } from '../i18n';
import type { Profile, Project, ExperienceData, Skill, ExperienceItem, EducationItem } from '../types';

// Caches are module-level; they reset on page reload (which happens on locale change)
let profileCache:    Profile | null       = null;
let experienceCache: ExperienceData | null = null;
let projectsCache:   Project[] | null     = null;

function langHeaders(): HeadersInit {
  return { 'Accept-Language': getLocale() };
}

// Render's free tier sleeps after inactivity and can take 30-50s to wake up.
// Without a timeout, a cold backend would leave the panel stuck on "loading"
// instead of falling back to the static JSON almost instantly.
const API_TIMEOUT_MS = 3500;

// Tries the API; returns the Response on success, null on any failure (including timeout)
async function apiFetch(path: string): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const r = await fetch(path, { headers: langHeaders(), signal: controller.signal });
    return r.ok ? r : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ── Raw API shapes (may differ from the frontend types) ──────────────────────

interface ApiProfile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  profileImageUrl: string;
  socialLinks: string[];
  skills: Skill[];
  experience: Array<{
    company?: string | null;
    position?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    description?: string | null;
    technologies?: string[] | null;
  }>;
  education: Array<{
    institution?: string | null;
    degree?: string | null;
    field?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    description?: string | null;
  }>;
}

interface ApiProject {
  id: number;
  name: string;
  description: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
  createdDate?: string;
  isFeatured?: boolean;
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function mapProfile(raw: ApiProfile): Profile {
  return {
    fullName:       raw.fullName,
    title:          raw.title,
    email:          raw.email,
    phone:          raw.phone,
    location:       raw.location,
    summary:        raw.summary,
    profileImageUrl: raw.profileImageUrl,
    socialLinks: {
      github:   raw.socialLinks?.find(l => l.includes('github'))   ?? raw.socialLinks?.[0] ?? '',
      linkedin: raw.socialLinks?.find(l => l.includes('linkedin')) ?? raw.socialLinks?.[1] ?? '',
    },
    skills: raw.skills ?? [],
  };
}

function mapExperience(raw: ApiProfile): ExperienceData {
  return {
    experience: (raw.experience ?? []).map((e): ExperienceItem => ({
      company:      e.company      ?? '',
      position:     e.position     ?? '',
      startDate:    e.startDate    ?? '',
      endDate:      e.endDate      ?? '',
      description:  e.description  ?? '',
      technologies: e.technologies ?? [],
    })),
    education: (raw.education ?? []).map((e): EducationItem => ({
      institution: e.institution ?? '',
      degree:      e.degree      ?? '',
      field:       e.field       ?? '',
      startDate:   e.startDate   ?? '',
      endDate:     e.endDate     ?? '',
      description: e.description ?? '',
    })),
  };
}

function mapProject(p: ApiProject): Project {
  return {
    id:           p.id,
    name:         p.name,
    description:  p.description,
    technologies: p.technologies ?? [],
    githubUrl:    p.githubUrl    ?? '',
    liveUrl:      p.liveUrl      ?? '',
    createdDate:  typeof p.createdDate === 'string' ? p.createdDate.split('T')[0] : '',
    isFeatured:   p.isFeatured   ?? false,
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getProfile(): Promise<Profile> {
  if (profileCache) return profileCache;

  const res = await apiFetch('/api/profile');
  if (res) {
    const raw: ApiProfile = await res.json();
    profileCache    = mapProfile(raw);
    experienceCache = mapExperience(raw);
  } else {
    // API unavailable – fall back to static JSON (always ES locale)
    profileCache = await (await fetch('/data/profile.json')).json() as Profile;
  }

  return profileCache;
}

export async function getProjects(): Promise<Project[]> {
  if (projectsCache) return projectsCache;

  const res = await apiFetch('/api/projects');
  if (res) {
    const raw: ApiProject[] = await res.json();
    projectsCache = raw.map(mapProject);
  } else {
    projectsCache = await (await fetch('/data/projects.json')).json();
  }

  return projectsCache!;
}

export async function getExperienceData(): Promise<ExperienceData> {
  if (experienceCache) return experienceCache;

  // Experience is bundled in the profile API response
  await getProfile();

  if (!experienceCache) {
    // getProfile fell back to static JSON; load experience separately
    experienceCache = await (await fetch('/data/experience.json')).json();
  }

  return experienceCache!;
}
