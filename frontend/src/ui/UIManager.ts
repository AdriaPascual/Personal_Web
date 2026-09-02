import type { ModalBuildingType } from '../types';
import { t } from '../i18n';
import { renderAbout }    from './panels/AboutPanel';
import { renderCV }       from './panels/CVPanel';
import { renderProjects } from './panels/ProjectsPanel';
import { renderContact, attachContactFormHandler } from './panels/ContactPanel';
import { renderGitHub }   from './panels/GitHubPanel';
import { renderLanguagePanel, attachLanguageHandler } from './panels/LanguagePanel';

const TITLE_KEY: Record<ModalBuildingType, string> = {
  about:     'panel.about',
  cv:        'panel.cv',
  projects:  'panel.projects',
  contact:   'panel.contact',
  github:    'panel.github',
  languages: 'panel.languages',
};

export class UIManager {
  private overlay: HTMLElement;
  private panel: HTMLElement | null = null;

  constructor() {
    this.overlay = document.getElementById('ui-overlay')!;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAll();
    });
  }

  async open(type: ModalBuildingType): Promise<void> {
    this.closeAll();

    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', t(TITLE_KEY[type]));

    const box = document.createElement('div');
    box.className = 'panel-box';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'panel-close';
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Cerrar');
    closeBtn.addEventListener('click', () => this.closeAll());

    const title = document.createElement('h2');
    title.className = 'panel-title';
    title.textContent = t(TITLE_KEY[type]);

    const content = document.createElement('div');
    content.innerHTML = '<p style="color:#666;font-size:.8rem;">Cargando...</p>';

    box.appendChild(closeBtn);
    box.appendChild(title);
    box.appendChild(content);
    panel.appendChild(box);

    panel.addEventListener('click', (e) => {
      if (e.target === panel) this.closeAll();
    });

    this.overlay.appendChild(panel);
    this.panel = panel;

    requestAnimationFrame(() => panel.classList.add('visible'));

    try {
      let html: string;
      switch (type) {
        case 'about':     html = await renderAbout();     break;
        case 'cv':        html = await renderCV();        break;
        case 'projects':  html = await renderProjects();  break;
        case 'contact':   html = renderContact();         break;
        case 'github':    html = await renderGitHub();    break;
        case 'languages': html = renderLanguagePanel();   break;
      }
      content.innerHTML = html;
      if (type === 'contact')   attachContactFormHandler();
      if (type === 'languages') attachLanguageHandler();
    } catch {
      content.innerHTML = '<p style="color:#f44336;">Error al cargar el contenido.</p>';
    }
  }

  closeAll(): void {
    if (!this.panel) return;
    const p = this.panel;
    p.classList.remove('visible');
    p.addEventListener('transitionend', () => p.remove(), { once: true });
    this.panel = null;
  }

  isOpen(): boolean {
    return this.panel !== null;
  }
}
