import { getProfile } from '../../services/dataService';
import { t } from '../../i18n';
import { escapeHtml, safeUrl } from '../../utils/htmlUtils';

const WEB_STACK = [
  { name: 'Three.js',      desc: '3D engine' },
  { name: 'TypeScript',    desc: 'Language' },
  { name: 'Vite',          desc: 'Build tool' },
  { name: '.NET 8',        desc: 'Backend' },
  { name: 'ASP.NET Core',  desc: 'API framework' },
  { name: 'SendGrid',      desc: 'Email' },
];

export async function renderAbout(): Promise<string> {
  const p = await getProfile();

  const skillsByCategory = p.skills.reduce((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {} as Record<string, typeof p.skills>);

  const skillsHtml = Object.entries(skillsByCategory).map(([cat, skills]) => `
    <p style="color:#888;font-size:.72rem;margin:0.6rem 0 0.3rem;text-transform:uppercase;letter-spacing:.08em;">${escapeHtml(cat)}</p>
    <div class="skill-grid">
      ${skills.map(s => `
        <div class="skill-item">
          <div class="skill-header"><span>${escapeHtml(s.name)}</span><span>${s.level}%</span></div>
          <div class="skill-bar"><div class="skill-fill" style="width:${s.level}%"></div></div>
        </div>
      `).join('')}
    </div>
  `).join('');

  const stackHtml = WEB_STACK.map(item => `
    <div class="skill-item">
      <div class="skill-header"><span>${item.name}</span><span style="color:#666">${item.desc}</span></div>
      <div class="skill-bar"><div class="skill-fill" style="width:100%;background:linear-gradient(90deg,#0f3460,#4ecdc4)"></div></div>
    </div>
  `).join('');

  return `
    <div style="display:flex;gap:1.5rem;align-items:flex-start;margin-bottom:1.25rem;flex-wrap:wrap;">
      <div style="flex:1;min-width:200px;">
        <h2 style="color:#e94560;font-size:1.1rem;margin-bottom:.25rem;">${escapeHtml(p.fullName)}</h2>
        <p style="color:#4ecdc4;font-size:.85rem;margin-bottom:.6rem;">${escapeHtml(p.title)}</p>
        <p style="color:#aaa;font-size:.8rem;line-height:1.5;">${escapeHtml(p.summary)}</p>
        <div style="margin-top:.75rem;font-size:.78rem;color:#666;">
          <div>📍 ${escapeHtml(p.location)}</div>
          <div>📧 <a href="mailto:${escapeHtml(p.email)}" style="color:#4ecdc4;text-decoration:none;">${escapeHtml(p.email)}</a></div>
          <div style="margin-top:.4rem;">
            <a href="${safeUrl(p.socialLinks.github)}"   target="_blank" rel="noopener noreferrer" style="color:#4ecdc4;margin-right:.75rem;">GitHub</a>
            <a href="${safeUrl(p.socialLinks.linkedin)}" target="_blank" rel="noopener noreferrer" style="color:#4ecdc4;">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
    <h3 class="panel-title" style="font-size:.9rem;">${t('about.skills')}</h3>
    ${skillsHtml}
    <h3 class="panel-title" style="font-size:.9rem;margin-top:1.25rem;">${t('about.webstack.title')}</h3>
    <div class="skill-grid">${stackHtml}</div>
  `;
}
