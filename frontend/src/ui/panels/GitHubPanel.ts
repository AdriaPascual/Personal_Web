import { getPublicRepos } from '../../services/githubService';
import { escapeHtml, safeUrl } from '../../utils/htmlUtils';

export async function renderGitHub(): Promise<string> {
  try {
    const repos = await getPublicRepos();
    const rows = repos.map(r => `
      <div class="repo-item">
        <div>
          <a href="${safeUrl(r.html_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.name)}</a>
          ${r.description ? `<div style="font-size:.7rem;color:#666;margin-top:2px;">${escapeHtml(r.description)}</div>` : ''}
        </div>
        <div class="repo-meta">
          ${r.language ? `<span style="color:#4ecdc4;">${escapeHtml(r.language)}</span>` : ''}
          ${r.stargazers_count ? ` ⭐ ${r.stargazers_count}` : ''}
        </div>
      </div>
    `).join('');

    return `
      <h3 class="panel-title">GitHub</h3>
      <p style="color:#666;font-size:.75rem;margin-bottom:.75rem;">Repositorios públicos · actualizado en tiempo real</p>
      <div class="repo-list">${rows}</div>
    `;
  } catch {
    return `
      <h3 class="panel-title">GitHub</h3>
      <p style="color:#888;font-size:.82rem;">No se pudo conectar con la API de GitHub. Inténtalo más tarde.</p>
      <p style="margin-top:.5rem;"><a href="https://github.com/AdriaPascual" target="_blank" rel="noopener noreferrer" style="color:#4ecdc4;">Ver perfil directo →</a></p>
    `;
  }
}
