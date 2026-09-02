import { getProjects } from '../../services/dataService';
import { t } from '../../i18n';
import { escapeHtml, safeUrl } from '../../utils/htmlUtils';

export async function renderProjects(): Promise<string> {
  const projects = await getProjects();

  const cards = projects.map(p => `
    <div class="project-card">
      <h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(p.description)}</p>
      <div class="tag-list">${p.technologies.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <div class="project-links" style="margin-top:.6rem;">
        ${p.githubUrl ? `<a href="${safeUrl(p.githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub →</a>` : ''}
        ${p.liveUrl   ? `<a href="${safeUrl(p.liveUrl)}"   target="_blank" rel="noopener noreferrer">Live →</a>`   : ''}
      </div>
    </div>
  `).join('');

  return `
    <div class="projects-disclaimer">
      <strong>${t('projects.disclaimer.title')}</strong>
      <p>${t('projects.disclaimer.body')}</p>
    </div>
    <div class="project-grid">${cards}</div>
  `;
}
