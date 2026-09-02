import * as THREE from 'three';
import { gridToWorld, MAP_COLS, MAP_ROWS, GRASS_H, TileType } from '../constants3D';

const MOVE_SPEED = 8;

const bodyMat = new THREE.MeshLambertMaterial({
  color: 0xff6b35,
  emissive: new THREE.Color(0xff3d00),
  emissiveIntensity: 0.18,
});
const skinMat   = new THREE.MeshLambertMaterial({ color: 0xffcb9a });
const darkMat   = new THREE.MeshLambertMaterial({ color: 0x2c2c3a });
const shadowMat = new THREE.MeshLambertMaterial({ color: 0x000000, transparent: true, opacity: 0.25 });

export class Player3D {
  col: number;
  row: number;
  private group:    THREE.Group;
  private targetX:  number;
  private targetZ:  number;
  private _atTarget = true;
  private _time     = 0;
  private tileMap:  TileType[][];
  private blocked:  Set<string>;

  get isAtTarget(): boolean { return this._atTarget; }
  get worldX():     number  { return this.group.position.x; }
  get worldZ():     number  { return this.group.position.z; }

  constructor(
    scene: THREE.Scene,
    col: number,
    row: number,
    tileMap: TileType[][],
    blocked: Set<string>,
  ) {
    this.col     = col;
    this.row     = row;
    this.tileMap = tileMap;
    this.blocked = blocked;
    const { x, z } = gridToWorld(col, row);
    this.targetX = x;
    this.targetZ = z;
    this.group   = this.buildMesh();
    this.group.position.set(x, 0, z);
    scene.add(this.group);
  }

  private buildMesh(): THREE.Group {
    const group = new THREE.Group();
    const B = GRASS_H;

    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.01, 16), shadowMat);
    disc.position.y = B + 0.005;
    group.add(disc);

    const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, 0.28, 8), darkMat);
    legs.position.y = B + 0.14;
    legs.castShadow = true;
    group.add(legs);

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 0.44, 8), bodyMat);
    body.position.y = B + 0.28 + 0.22;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 8), skinMat);
    head.position.y = B + 0.28 + 0.44 + 0.19;
    head.castShadow = true;
    group.add(head);

    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.04, 12), darkMat);
    brim.position.y = B + 0.28 + 0.44 + 0.38 + 0.03;
    group.add(brim);

    const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.22, 10), darkMat);
    hat.position.y = B + 0.28 + 0.44 + 0.38 + 0.09 + 0.11;
    hat.castShadow = true;
    group.add(hat);

    return group;
  }

  moveTo(col: number, row: number): boolean {
    if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return false;
    const tile = this.tileMap[row][col];
    if (tile !== TileType.Path && tile !== TileType.Cross) return false;
    if (this.blocked.has(`${col},${row}`)) return false;
    this.col     = col;
    this.row     = row;
    const { x, z } = gridToWorld(col, row);
    this.targetX = x;
    this.targetZ = z;
    this._atTarget = false;
    return true;
  }

  moveDir(dc: number, dr: number): boolean {
    return this.moveTo(this.col + dc, this.row + dr);
  }

  update(delta: number): boolean {
    this._time += delta;

    const dx   = this.targetX - this.group.position.x;
    const dz   = this.targetZ - this.group.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist > 0.005) {
      const step = Math.min(dist, MOVE_SPEED * delta);
      this.group.position.x += (dx / dist) * step;
      this.group.position.z += (dz / dist) * step;
      this.group.rotation.y  = Math.atan2(dx, dz);
      this.group.position.y = Math.abs(Math.sin(this._time * 22)) * 0.07;
      this._atTarget = false;
      return false;
    }

    if (!this._atTarget) {
      this.group.position.x = this.targetX;
      this.group.position.z = this.targetZ;
      this.group.position.y = 0;
      this._atTarget = true;
      return true;
    }
    return false;
  }
}
