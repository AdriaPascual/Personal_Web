import * as THREE from 'three';
import { gridToWorld, GRASS_H } from '../constants3D';
import { getDecorBuilding } from './AssetLoader';

interface DecorDef {
  col:   number;
  row:   number;
  model: string;
  rotY?: number;
}

const DECOR_DEFS: DecorDef[] = [
  // ── Inner-block filler buildings ──────────────────────────────
  { col: 5,  row: 5,  model: 'building-c.glb' },
  { col: 9,  row: 5,  model: 'building-f.glb',          rotY: Math.PI / 2 },
  { col: 13, row: 5,  model: 'building-e.glb' },
  { col: 17, row: 5,  model: 'building-c.glb',          rotY: Math.PI / 2 },
  { col: 21, row: 5,  model: 'building-f.glb' },
  { col: 5,  row: 9,  model: 'building-e.glb',          rotY: Math.PI },
  { col: 9,  row: 9,  model: 'building-c.glb',          rotY: -Math.PI / 2 },
  { col: 13, row: 9,  model: 'building-f.glb',          rotY: Math.PI },
  { col: 17, row: 9,  model: 'building-e.glb',          rotY: -Math.PI / 2 },
  { col: 21, row: 9,  model: 'building-c.glb' },

  // ── Background skyline — north (rows 1-2) ─────────────────────
  { col: 1,  row: 1,  model: 'building-skyscraper-c.glb' },
  { col: 4,  row: 2,  model: 'low-detail-building-a.glb' },
  { col: 6,  row: 1,  model: 'building-skyscraper-d.glb' },
  { col: 8,  row: 2,  model: 'building-skyscraper-c.glb' },
  { col: 10, row: 1,  model: 'building-skyscraper-d.glb', rotY: Math.PI / 4 },
  { col: 12, row: 2,  model: 'low-detail-building-b.glb' },
  { col: 14, row: 1,  model: 'building-skyscraper-c.glb', rotY: Math.PI / 2 },
  { col: 16, row: 2,  model: 'building-skyscraper-d.glb' },
  { col: 18, row: 1,  model: 'low-detail-building-a.glb' },
  { col: 20, row: 2,  model: 'building-skyscraper-c.glb' },
  { col: 22, row: 1,  model: 'building-skyscraper-d.glb', rotY: Math.PI / 4 },
  { col: 24, row: 2,  model: 'low-detail-building-b.glb' },
  { col: 26, row: 1,  model: 'building-skyscraper-c.glb' },

  // ── Background skyline — south (rows 13-14) ───────────────────
  { col: 1,  row: 14, model: 'building-skyscraper-c.glb', rotY: Math.PI },
  { col: 4,  row: 13, model: 'low-detail-building-b.glb', rotY: Math.PI },
  { col: 6,  row: 14, model: 'building-skyscraper-d.glb', rotY: Math.PI },
  { col: 8,  row: 13, model: 'building-skyscraper-c.glb', rotY: -Math.PI / 2 },
  { col: 10, row: 14, model: 'building-skyscraper-d.glb', rotY: Math.PI },
  { col: 12, row: 13, model: 'low-detail-building-a.glb', rotY: Math.PI },
  { col: 14, row: 14, model: 'building-skyscraper-c.glb', rotY: Math.PI },
  { col: 16, row: 13, model: 'building-skyscraper-d.glb', rotY: Math.PI },
  { col: 18, row: 14, model: 'low-detail-building-a.glb', rotY: Math.PI },
  { col: 20, row: 13, model: 'building-skyscraper-c.glb', rotY: Math.PI },
  { col: 22, row: 14, model: 'building-skyscraper-d.glb', rotY: Math.PI },
  { col: 24, row: 13, model: 'low-detail-building-b.glb', rotY: Math.PI },
  { col: 26, row: 14, model: 'building-skyscraper-c.glb', rotY: Math.PI },

  // ── West edge ─────────────────────────────────────────────────
  { col: 1, row: 5,  model: 'building-f.glb', rotY: -Math.PI / 2 },
  { col: 1, row: 7,  model: 'building-e.glb', rotY: -Math.PI / 2 },
  { col: 1, row: 9,  model: 'building-f.glb', rotY: -Math.PI / 2 },
  { col: 2, row: 5,  model: 'low-detail-building-a.glb' },
  { col: 2, row: 9,  model: 'low-detail-building-b.glb' },

  // ── East edge ─────────────────────────────────────────────────
  { col: 25, row: 5,  model: 'building-f.glb', rotY: Math.PI / 2 },
  { col: 25, row: 7,  model: 'building-e.glb', rotY: Math.PI / 2 },
  { col: 25, row: 9,  model: 'building-f.glb', rotY: Math.PI / 2 },
  { col: 26, row: 5,  model: 'building-skyscraper-d.glb' },
  { col: 26, row: 9,  model: 'building-skyscraper-c.glb' },
];

function placeDecorBuilding(scene: THREE.Scene, def: DecorDef): void {
  const { x, z } = gridToWorld(def.col, def.row);
  const model     = getDecorBuilding(def.model);

  const box  = new THREE.Box3().setFromObject(model);
  const ctr  = box.getCenter(new THREE.Vector3());
  model.position.set(-ctr.x, GRASS_H - box.min.y, -ctr.z);

  if (def.rotY !== undefined) model.rotation.y = def.rotY;

  const group = new THREE.Group();
  group.add(model);
  group.position.set(x, 0, z);
  scene.add(group);
}

export function addCityDecor(scene: THREE.Scene): void {
  for (const def of DECOR_DEFS) placeDecorBuilding(scene, def);
}
