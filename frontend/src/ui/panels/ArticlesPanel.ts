import { getArticles } from '../../services/dataService';
import { getLocale } from '../../i18n';
import { escapeHtml } from '../../utils/htmlUtils';

function formatDate(iso: string): string {
  const locale = { es: 'es-ES', en: 'en-GB', ca: 'ca-ES' }[getLocale()];
  return new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

export async function renderArticles(): Promise<string> {
  const articles = await getArticles();

  return articles.map(a => `
    <article class="article-item">
      <h3 class="article-title">${escapeHtml(a.title)}</h3>
      <div class="article-date">${escapeHtml(formatDate(a.date))}</div>
      ${a.body.map(p => `<p class="article-paragraph">${escapeHtml(p)}</p>`).join('')}
    </article>
  `).join('<hr class="article-divider" />');
}
