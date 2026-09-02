import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { BuildingType } from '../../types';

const CITY = '/assets/city/';

// Portfolio buildings (interactive)
const BUILDING_FILE: Record<BuildingType, string> = {
  about:    CITY + 'building-a.glb',
  cv:       CITY + 'building-skyscraper-a.glb',
  projects: CITY + 'building-d.glb',
  contact:  CITY + 'building-b.glb',
  github:   CITY + 'building-skyscraper-b.glb',
  linkedin:  CITY + 'building-skyscraper-b.glb',
  unlimioo:  CITY + 'building-skyscraper-a.glb',
  articles:  CITY + 'building-d.glb',
  languages: CITY + 'building-b.glb',
};

// Decorative city buildings (non-interactive)
const DECOR_FILES: [string, number][] = [
  [CITY + 'building-c.glb',              1.2],
  [CITY + 'building-e.glb',              1.2],
  [CITY + 'building-f.glb',              1.2],
  [CITY + 'building-skyscraper-c.glb',   1.0],
  [CITY + 'building-skyscraper-d.glb',   1.0],
  [CITY + 'low-detail-building-a.glb',   1.3],
  [CITY + 'low-detail-building-b.glb',   1.3],
];

const BUILDING_FOOTPRINT = 1.8;

const gltfLoader = new GLTFLoader();
const cache      = new Map<string, THREE.Group>();

function loadGLB(url: string): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    gltfLoader.load(url, (gltf) => {
      gltf.scene.traverse((n) => {
        if (n instanceof THREE.Mesh) {
          n.castShadow    = true;
          n.receiveShadow = true;
        }
      });
      resolve(gltf.scene);
    }, undefined, reject);
  });
}

function normalizeFootprint(group: THREE.Group, target: number): void {
  group.updateMatrixWorld(true);
  const size = new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3());
  const fp   = Math.max(size.x, size.z);
  if (fp > 0) group.scale.setScalar(target / fp);
}

export async function preloadAssets(): Promise<void> {
  const jobs: Array<Promise<void>> = [];

  for (const type of Object.keys(BUILDING_FILE) as BuildingType[]) {
    const file = BUILDING_FILE[type];
    jobs.push(
      loadGLB(file).then((g) => {
        normalizeFootprint(g, BUILDING_FOOTPRINT);
        cache.set(`b_${type}`, g);
      }),
    );
  }

  for (const [file, fp] of DECOR_FILES) {
    jobs.push(
      loadGLB(file).then((g) => {
        normalizeFootprint(g, fp);
        cache.set(file, g);
      }),
    );
  }

  await Promise.all(jobs);
}

export function getBuilding(type: BuildingType): THREE.Group {
  const g = cache.get(`b_${type}`);
  if (!g) throw new Error(`Building "${type}" not preloaded`);
  return g.clone(true);
}

export function getDecorBuilding(file: string): THREE.Group {
  const url = CITY + file;
  const g   = cache.get(url);
  if (!g) throw new Error(`Decor model "${url}" not preloaded`);
  return g.clone(true);
}
