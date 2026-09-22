import { getLocale, type Locale } from '../i18n';
import type { Profile, Project, ExperienceData } from '../types';

// Contenido estático (perfil, proyectos, experiencia) importado directamente en vez
// de servido por fetch: Vite lo empaqueta dentro del propio JS, así que está
// disponible al instante en memoria, sin ninguna petición de red ni espera.
// Antes se intentaba primero el backend .NET y se caía a un JSON estático si no
// respondía a tiempo (Render duerme en el plan free); como el contenido es
// idéntico en ambos sitios, ya no tiene sentido esperar a la red para esto.
import profileEs from '../data/profile.es.json';
import profileEn from '../data/profile.en.json';
import profileCa from '../data/profile.ca.json';
import projectsEs from '../data/projects.es.json';
import projectsEn from '../data/projects.en.json';
import projectsCa from '../data/projects.ca.json';
import experienceEs from '../data/experience.es.json';
import experienceEn from '../data/experience.en.json';
import experienceCa from '../data/experience.ca.json';

const PROFILE_BY_LOCALE: Record<Locale, Profile> = { es: profileEs, en: profileEn, ca: profileCa };
const PROJECTS_BY_LOCALE: Record<Locale, Project[]> = { es: projectsEs, en: projectsEn, ca: projectsCa };
const EXPERIENCE_BY_LOCALE: Record<Locale, ExperienceData> = { es: experienceEs, en: experienceEn, ca: experienceCa };

// Se mantienen como funciones async (aunque ya no haya nada asíncrono que esperar)
// para no tener que tocar los paneles que ya hacen await getProfile(), etc.
export async function getProfile(): Promise<Profile> {
  return PROFILE_BY_LOCALE[getLocale()];
}

export async function getProjects(): Promise<Project[]> {
  return PROJECTS_BY_LOCALE[getLocale()];
}

export async function getExperienceData(): Promise<ExperienceData> {
  return EXPERIENCE_BY_LOCALE[getLocale()];
}
