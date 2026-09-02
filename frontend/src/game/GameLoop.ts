import { GameEngine } from './GameEngine';
import { buildTileMap, renderTileMap } from './world/TileGrid3D';
import { Building3D, type BuildingDef } from './world/Building3D';
import { Player3D } from './world/Player3D';
import { addDecor } from './world/Decor3D';
import { addCityDecor } from './world/CityDecor';
import { TrainDecor } from './world/TrainDecor';
import { UIManager } from '../ui/UIManager';
import { t } from '../i18n';
import type { ModalBuildingType } from '../types';

const BUILDINGS: BuildingDef[] = [
  { type: 'about',     col: 3,  row: 3  },
  { type: 'cv',        col: 11, row: 3  },
  { type: 'linkedin',  col: 23, row: 3,  kind: 'link', url: 'https://www.linkedin.com/in/adria-pascual-cuesta/' },
  { type: 'languages', col: 7,  row: 7  },
  { type: 'contact',   col: 3,  row: 11 },
  { type: 'projects',  col: 11, row: 11 },
  { type: 'unlimioo',  col: 23, row: 11, kind: 'link', url: 'https://www.unlimioo.com/', featured: true },
  { type: 'articles',  col: 15, row: 7,  kind: 'wip' },
];

const CAM_Y  = 11;
const CAM_DZ =  8.5;

export class GameLoop {
  private engine:    GameEngine;
  private player!:   Player3D;
  private buildings: Building3D[] = [];
  private ui!:       UIManager;
  private hint!:     HTMLElement;
  private near:      Building3D | null = null;
  private train:     TrainDecor | null = null;

  private keys     = new Set<string>();
  private eWasDown = false;

  // Welcome bubble
  private welcomeBubble: HTMLElement | null = null;
  private welcomeGone   = false;

  // Collision flash
  private collisionFlash:   HTMLElement | null = null;
  private lastBumpDir       = '';        // throttle: only flash once per direction hold
  private bumpFlashTimer:   ReturnType<typeof setTimeout> | null = null;

  constructor(engine: GameEngine) {
    this.engine = engine;
    this.ui     = new UIManager();
    this.hint   = document.getElementById('interact-hint')!;
    this.welcomeBubble  = document.getElementById('welcome-bubble');
    this.collisionFlash = document.getElementById('collision-flash');

    const tileMap = buildTileMap();
    renderTileMap(engine.scene, tileMap);
    addDecor(engine.scene);
    addCityDecor(engine.scene);

    for (const def of BUILDINGS) this.buildings.push(new Building3D(engine.scene, def));

    // Buildings are visually present but do NOT block movement —
    // streets stay fully traversable; interaction is proximity-based.
    const blocked = new Set<string>();
    this.player = new Player3D(engine.scene, 11, 7, tileMap, blocked);

    engine.camera.position.set(this.player.worldX, CAM_Y, this.player.worldZ + CAM_DZ);
    engine.camera.lookAt(this.player.worldX, 0, this.player.worldZ);

    TrainDecor.create(engine.scene).then(t => { this.train = t; });

    this.setupInput();
    engine.onUpdate((dt) => this.tick(dt));
  }

  private setupInput(): void {
    document.addEventListener('keydown', (e) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      this.keys.add(e.code);
      if (e.code === 'Escape') this.ui.closeAll();
    });
    document.addEventListener('keyup', (e) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      this.keys.delete(e.code);
    });

    // Virtual D-pad / action buttons for touch devices
    document.querySelectorAll<HTMLElement>('[data-key]').forEach(btn => {
      const code = btn.dataset.key!;
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        document.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }));
      }, { passive: false });
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        document.dispatchEvent(new KeyboardEvent('keyup', { code, bubbles: true }));
      }, { passive: false });
    });
  }

  private hideWelcome(): void {
    if (this.welcomeGone) return;
    this.welcomeGone = true;
    this.welcomeBubble?.classList.add('hidden');
  }

  private triggerBump(dirKey: string): void {
    if (dirKey === this.lastBumpDir) return; // same direction held down — don't re-flash
    this.lastBumpDir = dirKey;
    if (!this.collisionFlash) return;
    if (this.bumpFlashTimer) clearTimeout(this.bumpFlashTimer);
    this.collisionFlash.classList.add('active');
    this.bumpFlashTimer = setTimeout(() => {
      this.collisionFlash!.classList.remove('active');
      this.bumpFlashTimer = null;
    }, 180);
  }

  private getDir(): [number, number] {
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp'))    return [ 0, -1];
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown'))  return [ 0, +1];
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft'))  return [-1,  0];
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) return [+1,  0];
    return [0, 0];
  }

  private tick(dt: number): void {
    const justArrived = this.player.update(dt);
    this.train?.update(dt);

    if (!this.ui.isOpen()) {
      const [dc, dr] = this.getDir();
      if (dc !== 0 || dr !== 0) {
        if (this.player.isAtTarget) {
          const moved = this.player.moveDir(dc, dr);
          if (moved) {
            this.hideWelcome();
            this.lastBumpDir = ''; // reset so new direction triggers fresh bump
          } else {
            this.triggerBump(`${dc},${dr}`);
          }
        }
      } else {
        this.lastBumpDir = ''; // released keys — next collision is a fresh bump
      }
    }

    const tx = this.player.worldX;
    const tz = this.player.worldZ;
    const cam = this.engine.camera;
    const s = Math.min(1, dt * 10);
    cam.position.x += (tx - cam.position.x) * s;
    cam.position.z += (tz + CAM_DZ - cam.position.z) * s;
    cam.lookAt(cam.position.x, 0, cam.position.z - CAM_DZ);

    if (justArrived) this.checkProximity();

    const eDown = this.keys.has('KeyE');
    if (eDown && !this.eWasDown && !this.ui.isOpen()) {
      this.hideWelcome();
      if (this.near) {
        const b = this.near;
        if (b.kind === 'link' && b.url) {
          window.open(b.url, '_blank', 'noopener,noreferrer');
        } else if (b.kind === 'wip') {
          this.showToast(t('toast.soon'));
        } else {
          this.ui.open(b.type as ModalBuildingType);
        }
      }
    }
    this.eWasDown = eDown;
  }

  private checkProximity(): void {
    let closest: Building3D | null = null;
    let minD = 2;

    for (const b of this.buildings) {
      const d = Math.max(
        Math.abs(b.col - this.player.col),
        Math.abs(b.row - this.player.row),
      );
      if (d < minD) { minD = d; closest = b; }
    }

    if (closest !== this.near) {
      this.near = closest;
      if (closest) {
        this.hint.innerHTML =
          closest.kind === 'link' ? t('hint.open') :
          closest.kind === 'wip'  ? t('hint.soon') :
                                    t('hint.enter');
      }
      this.hint.classList.toggle('visible', closest !== null);
    }
  }

  private showToast(msg: string): void {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('visible'));
    setTimeout(() => {
      el.classList.remove('visible');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
    }, 2200);
  }
}
