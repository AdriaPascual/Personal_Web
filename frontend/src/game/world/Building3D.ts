import * as THREE from 'three';
import { gridToWorld, GRASS_H } from '../constants3D';
import { getBuilding } from './AssetLoader';
import { t } from '../../i18n';
import type { BuildingType } from '../../types';

const LABEL_KEY: Record<BuildingType, string> = {
  about:     'building.about',
  cv:        'building.cv',
  projects:  'building.projects',
  contact:   'building.contact',
  github:    'building.github',
  linkedin:  'building.linkedin',
  unlimioo:  'building.unlimioo',
  articles:  'building.articles',
  languages: 'building.languages',
};

export interface BuildingDef {
  type:      BuildingType;
  col:       number;
  row:       number;
  kind?:     'modal' | 'link' | 'wip';
  url?:      string;
  featured?: boolean; // highlighted label (gold accent)
}

export class Building3D {
  readonly type:     BuildingType;
  readonly col:      number;
  readonly row:      number;
  readonly kind:     'modal' | 'link' | 'wip';
  readonly url:      string | undefined;
  readonly featured: boolean;

  constructor(scene: THREE.Scene, def: BuildingDef) {
    this.type     = def.type;
    this.col      = def.col;
    this.row      = def.row;
    this.kind     = def.kind ?? 'modal';
    this.url      = def.url;
    this.featured = def.featured ?? false;

    const { x, z } = gridToWorld(def.col, def.row);
    const group     = new THREE.Group();

    const model = getBuilding(def.type);
    const box   = new THREE.Box3().setFromObject(model);
    const ctr   = box.getCenter(new THREE.Vector3());
    model.position.set(-ctr.x, GRASS_H - box.min.y, -ctr.z);
    group.add(model);

    const labelY = GRASS_H + (box.max.y - box.min.y) + 0.7;
    group.add(makeLabel(t(LABEL_KEY[def.type]), labelY, this.kind, this.featured));

    group.position.set(x, 0, z);
    scene.add(group);
  }
}

// ── Canvas helpers ────────────────────────────────────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x,     y + r);
  ctx.arcTo(x,     y,     x + r, y,          r);
  ctx.closePath();
}

function makeLabel(
  text:     string,
  y:        number,
  kind:     'modal' | 'link' | 'wip',
  featured: boolean,
): THREE.Sprite {
  const W = 288, H = 68;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Palette per kind ──
  let bg:     string;
  let fg:     string;
  let border: string;
  let icon:   string;
  let fontSize: number;

  if (featured) {
    bg       = 'rgba(70, 42, 0, 0.96)';
    fg       = '#FFD700';
    border   = '#FFA500';
    icon     = '⭐ ';
    fontSize = 25;
  } else if (kind === 'wip') {
    bg       = 'rgba(55, 36, 4, 0.93)';
    fg       = '#FFCC00';
    border   = '#996600';
    icon     = '🚧 ';
    fontSize = 22;
  } else if (kind === 'link') {
    bg       = 'rgba(4, 26, 54, 0.93)';
    fg       = '#4ECDC4';
    border   = '#4ECDC4';
    icon     = '↗ ';
    fontSize = 22;
  } else {
    bg       = 'rgba(8, 8, 22, 0.91)';
    fg       = '#FFFFFF';
    border   = '#E94560';
    icon     = '';
    fontSize = 22;
  }

  const r = 11;
  const pad = 3;

  // Outer glow ring
  ctx.globalAlpha = 0.55;
  ctx.fillStyle   = border;
  roundRect(ctx, 1, 1, W - 2, H - 2, r + 1);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Background pill
  ctx.fillStyle = bg;
  roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, r);
  ctx.fill();

  // Inner border line
  ctx.strokeStyle = border;
  ctx.lineWidth   = 1.5;
  ctx.globalAlpha = 0.7;
  roundRect(ctx, pad + 1, pad + 1, W - (pad + 1) * 2, H - (pad + 1) * 2, r - 1);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Text shadow
  ctx.shadowColor  = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur   = 5;
  ctx.shadowOffsetY = 1;

  ctx.font         = `bold ${fontSize}px "Courier New", monospace`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = fg;
  ctx.fillText(icon + text, W / 2, H / 2);

  // Reset shadow so it doesn't affect other canvases
  ctx.shadowColor  = 'transparent';
  ctx.shadowBlur   = 0;
  ctx.shadowOffsetY = 0;

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
  const spr = new THREE.Sprite(mat);

  // featured label is slightly larger
  spr.scale.set(featured ? 2.65 : 2.35, featured ? 0.56 : 0.52, 1);
  spr.position.y = y;
  return spr;
}
