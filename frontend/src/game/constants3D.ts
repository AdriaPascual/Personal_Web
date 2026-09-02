export const MAP_COLS = 28;
export const MAP_ROWS = 16;
export const TILE_SIZE = 1;

export const GRASS_H = 0.28;
export const PATH_H  = 0.14;
export const WATER_H = 0.06;

export const STREET_COLS = [3, 7, 11, 15, 19, 23] as const;
export const STREET_ROWS = [3, 7, 11] as const;

const OX = -(MAP_COLS - 1) / 2;
const OZ = -(MAP_ROWS - 1) / 2;

export function gridToWorld(col: number, row: number): { x: number; z: number } {
  return { x: col + OX, z: row + OZ };
}

export const TileType = {
  Grass: 0, Path: 1, Water: 2, Sand: 3, Cross: 4, Void: 5,
} as const;
export type TileType = typeof TileType[keyof typeof TileType];
