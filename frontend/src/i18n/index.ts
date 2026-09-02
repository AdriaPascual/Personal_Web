export type Locale = 'es' | 'en' | 'ca';

const STORAGE_KEY = 'locale';

const UI: Record<Locale, Record<string, string>> = {
  es: {
    'loading':         'Cargando mundo…',
    'hint.enter':      'Pulsa <strong>E</strong> para entrar',
    'hint.open':       'Pulsa <strong>E</strong> para abrir',
    'hint.soon':       '🚧 <strong>Próximamente</strong>',
    'toast.soon':      '🚧 Próximamente…',
    'controls.move':   'moverse',
    'controls.enter':  'entrar',
    'controls.close':  'cerrar',
    'building.about':     'Sobre mí',
    'building.cv':        'CV',
    'building.projects':  'Proyectos',
    'building.contact':   'Contacto',
    'building.github':    'GitHub',
    'building.linkedin':  'LinkedIn',
    'building.unlimioo':  'Unlimioo.com',
    'building.articles':  'Artículos',
    'building.languages': 'Idiomas',
    'panel.about':        '🏠 Sobre mí',
    'panel.cv':           '📚 CV & Experiencia',
    'panel.projects':     '🎮 Proyectos',
    'panel.contact':      '📬 Contacto',
    'panel.github':       '🐙 GitHub',
    'panel.languages':    '🌐 Idioma',
    'lang.select':    'Selecciona idioma',
    'lang.es':        'Español',
    'lang.en':        'English',
    'lang.ca':        'Català',
    'lang.active':    'activo',
    'projects.disclaimer.title':   '⚠️ Nota sobre estos proyectos',
    'projects.disclaimer.body':    'Estos proyectos son de mis inicios como desarrollador. Mi trabajo actual es profesional y, por acuerdo de confidencialidad, no puede mostrarse públicamente.',
    'about.webstack.title':        'Stack de esta web',
    'about.skills':               'Habilidades',
    'cv.experience':              'Experiencia',
    'cv.education':               'Formación',
    'welcome.line1':              '¡Bienvenido a mi mundo!',
    'welcome.line2':              'Soy Adrià Pascual Cuesta. Muévete con W A S D y pulsa E cerca de un edificio para interactuar.',
  },
  en: {
    'loading':         'Loading world…',
    'hint.enter':      'Press <strong>E</strong> to enter',
    'hint.open':       'Press <strong>E</strong> to open',
    'hint.soon':       '🚧 <strong>Coming soon</strong>',
    'toast.soon':      '🚧 Coming soon…',
    'controls.move':   'move',
    'controls.enter':  'enter',
    'controls.close':  'close',
    'building.about':     'About me',
    'building.cv':        'Resume',
    'building.projects':  'Projects',
    'building.contact':   'Contact',
    'building.github':    'GitHub',
    'building.linkedin':  'LinkedIn',
    'building.unlimioo':  'Unlimioo.com',
    'building.articles':  'Articles',
    'building.languages': 'Languages',
    'panel.about':        '🏠 About me',
    'panel.cv':           '📚 Resume & Experience',
    'panel.projects':     '🎮 Projects',
    'panel.contact':      '📬 Contact',
    'panel.github':       '🐙 GitHub',
    'panel.languages':    '🌐 Language',
    'lang.select':    'Select language',
    'lang.es':        'Español',
    'lang.en':        'English',
    'lang.ca':        'Català',
    'lang.active':    'active',
    'projects.disclaimer.title':   '⚠️ Note about these projects',
    'projects.disclaimer.body':    'These projects are from my early days as a developer. My current work is professional and, under confidentiality agreements, cannot be shown publicly.',
    'about.webstack.title':        'This website\'s stack',
    'about.skills':               'Skills',
    'cv.experience':              'Experience',
    'cv.education':               'Education',
    'welcome.line1':              'Welcome to my world!',
    'welcome.line2':              "I'm Adrià Pascual Cuesta. Move with W A S D and press E near a building to interact.",
  },
  ca: {
    'loading':         'Carregant el món…',
    'hint.enter':      'Prem <strong>E</strong> per entrar',
    'hint.open':       'Prem <strong>E</strong> per obrir',
    'hint.soon':       '🚧 <strong>Properament</strong>',
    'toast.soon':      '🚧 Properament…',
    'controls.move':   'moure',
    'controls.enter':  'entrar',
    'controls.close':  'tancar',
    'building.about':     'Sobre mi',
    'building.cv':        'CV',
    'building.projects':  'Projectes',
    'building.contact':   'Contacte',
    'building.github':    'GitHub',
    'building.linkedin':  'LinkedIn',
    'building.unlimioo':  'Unlimioo.com',
    'building.articles':  'Articles',
    'building.languages': 'Idiomes',
    'panel.about':        '🏠 Sobre mi',
    'panel.cv':           '📚 CV & Experiència',
    'panel.projects':     '🎮 Projectes',
    'panel.contact':      '📬 Contacte',
    'panel.github':       '🐙 GitHub',
    'panel.languages':    '🌐 Idioma',
    'lang.select':    'Selecciona idioma',
    'lang.es':        'Español',
    'lang.en':        'English',
    'lang.ca':        'Català',
    'lang.active':    'actiu',
    'projects.disclaimer.title':   '⚠️ Nota sobre aquests projectes',
    'projects.disclaimer.body':    'Aquests projectes són dels meus inicis com a desenvolupador. El meu treball actual és professional i, per acord de confidencialitat, no es pot mostrar públicament.',
    'about.webstack.title':        "Stack d'aquesta web",
    'about.skills':               'Habilitats',
    'cv.experience':              'Experiència',
    'cv.education':               'Formació',
    'welcome.line1':              'Benvingut al meu món!',
    'welcome.line2':              "Soc l'Adrià Pascual Cuesta. Mou-te amb W A S D i prem E prop d'un edifici per interactuar.",
  },
};

let _locale: Locale = (localStorage.getItem(STORAGE_KEY) as Locale) ?? 'es';

export function getLocale(): Locale { return _locale; }

export function setLocale(locale: Locale): void {
  localStorage.setItem(STORAGE_KEY, locale);
  location.reload();
}

export function t(key: string): string {
  return UI[_locale][key] ?? UI['es'][key] ?? key;
}

export function applyToDOM(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')!;
    el.innerHTML = t(key);
  });
  document.documentElement.lang = _locale;
}
