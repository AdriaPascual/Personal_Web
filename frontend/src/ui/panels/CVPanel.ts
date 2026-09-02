import { getExperienceData } from '../../services/dataService';
import { t } from '../../i18n';
import { escapeHtml } from '../../utils/htmlUtils';

export async function renderCV(): Promise<string> {
  const { experience, education } = await getExperienceData();

  const expHtml = experience.map(e => `
    <div class="timeline-item">
      <h3>${escapeHtml(e.position)}</h3>
      <div class="meta">${escapeHtml(e.company)} · ${escapeHtml(e.startDate)} – ${escapeHtml(e.endDate)}</div>
      <p>${escapeHtml(e.description)}</p>
      <div class="tag-list">${e.technologies.map(tech => `<span class="tag">${escapeHtml(tech)}</span>`).join('')}</div>
    </div>
  `).join('');

  const eduHtml = education.map(e => `
    <div class="timeline-item">
      <h3>${escapeHtml(e.degree)}</h3>
      <div class="meta">${escapeHtml(e.institution)} · ${escapeHtml(e.startDate)} – ${escapeHtml(e.endDate)}</div>
      ${e.description ? `<p>${escapeHtml(e.description)}</p>` : ''}
    </div>
  `).join('');

  return `
    <h3 class="panel-title">${t('cv.experience')}</h3>
    ${expHtml}
    <h3 class="panel-title" style="margin-top:1.25rem;">${t('cv.education')}</h3>
    ${eduHtml}
  `;
}
