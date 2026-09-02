import * as THREE from 'three';
import {
  MAP_COLS, MAP_ROWS, TILE_SIZE,
  GRASS_H, PATH_H, WATER_H,
  TileType, gridToWorld, STREET_COLS, STREET_ROWS,
} from '../constants3D';

export { gridToWorld };

const TILE_COLOR: Record<TileType, number> = {
  [TileType.Grass]: 0x52b862,
  [TileType.Path]:  0xa89880,
  [TileType.Water]: 0x2a78b0,
  [TileType.Sand]:  0xd2b07e,
  [TileType.Cross]: 0x9a8c7a,
  [TileType.Void]:  0x111122,
};

// Slight grass colour alternation so the ground has visible texture
const GRASS_ALT = 0x5dc96a;

const TILE_H: Record<TileType, number> = {
  [TileType.Grass]: GRASS_H,
  [TileType.Path]:  PATH_H,
  [TileType.Water]: WATER_H,
  [TileType.Sand]:  GRASS_H,
  [TileType.Cross]: PATH_H,
  [TileType.Void]:  0.04,
};

export function buildTileMap(): TileType[][] {
  const map: TileType[][] = Array.from({ length: MAP_ROWS }, () =>
    Array(MAP_COLS).fill(TileType.Grass),
  );

  // Horizontal streets — full width
  for (const r of STREET_ROWS) {
    for (let c = 0; c < MAP_COLS; c++) map[r][c] = TileType.Path;
  }
  // Vertical streets — full height
  for (const c of STREET_COLS) {
    for (let r = 0; r < MAP_ROWS; r++) map[r][c] = TileType.Path;
  }
  // Intersections
  for (const r of STREET_ROWS) {
    for (const c of STREET_COLS) map[r][c] = TileType.Cross;
  }
  return map;
}

export function renderTileMap(scene: THREE.Scene, map: TileType[][]): void {
  const geoCache = new Map<number, THREE.BoxGeometry>();
  const matCache = new Map<number, THREE.MeshLambertMaterial>();

  const getGeo = (h: number) => {
    if (!geoCache.has(h)) geoCache.set(h, new THREE.BoxGeometry(TILE_SIZE, h, TILE_SIZE));
    return geoCache.get(h)!;
  };
  const getMat = (color: number) => {
    if (!matCache.has(color)) matCache.set(color, new THREE.MeshLambertMaterial({ color }));
    return matCache.get(color)!;
  };

  for (let r = 0; r < MAP_ROWS; r++) {
    for (let c = 0; c < MAP_COLS; c++) {
      const type = map[r][c];
      const h    = TILE_H[type];

      // Alternate grass shade in a checker-like pattern for visual texture
      let color = TILE_COLOR[type];
      if (type === TileType.Grass && (c + r) % 2 === 1) color = GRASS_ALT;

      const mesh = new THREE.Mesh(getGeo(h), getMat(color));
      const { x, z } = gridToWorld(c, r);
      mesh.position.set(x, h / 2, z);
      mesh.receiveShadow = true;
      scene.add(mesh);
    }
  }
}
