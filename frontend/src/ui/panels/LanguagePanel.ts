import { getLocale, setLocale, t, type Locale } from '../../i18n';

export function renderLanguagePanel(): string {
  const current = getLocale();
  const langs: { code: Locale; flag: string }[] = [
    { code: 'es', flag: '🇪🇸' },
    { code: 'en', flag: '🇬🇧' },
    // Unicode no tiene un emoji de bandera para Cataluña (el mecanismo de "tag
    // sequences" solo reconoce Inglaterra/Escocia/Gales); se dibuja como SVG.
    {
      code: 'ca',
      flag: `<svg viewBox="0 0 27 18" width="20" height="14" style="vertical-align:middle;border-radius:2px;" aria-hidden="true">
        <rect width="27" height="18" fill="#FCDD09"/>
        <rect y="2" width="27" height="2" fill="#DA121A"/>
        <rect y="6" width="27" height="2" fill="#DA121A"/>
        <rect y="10" width="27" height="2" fill="#DA121A"/>
        <rect y="14" width="27" height="2" fill="#DA121A"/>
      </svg>`,
    },
  ];

  const buttons = langs.map(l => `
    <button
      class="lang-btn${l.code === current ? ' active' : ''}"
      data-lang="${l.code}"
    >
      <span class="lang-flag">${l.flag}</span>
      <span class="lang-name">${t(`lang.${l.code}`)}</span>
      ${l.code === current ? `<span class="lang-check">✓</span>` : ''}
    </button>
  `).join('');

  return `
    <p style="color:#888;font-size:.8rem;margin-bottom:1rem;">${t('lang.select')}</p>
    <div class="lang-grid">${buttons}</div>
  `;
}

export function attachLanguageHandler(): void {
  document.querySelectorAll<HTMLButtonElement>('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang as Locale;
      if (lang) setLocale(lang);
    });
  });
}
