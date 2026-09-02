import { getLocale, setLocale, t, type Locale } from '../../i18n';

export function renderLanguagePanel(): string {
  const current = getLocale();
  const langs: { code: Locale; flag: string }[] = [
    { code: 'es', flag: '🇪🇸' },
    { code: 'en', flag: '🇬🇧' },
    { code: 'ca', flag: '\u{1F3F4}\u{E0065}\u{E0073}\u{E0063}\u{E0074}\u{E007F}' }, // Catalan Senyera
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
