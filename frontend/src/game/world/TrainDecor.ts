import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GRASS_H, MAP_COLS, MAP_ROWS } from '../constants3D';

const TRAIN_BASE = '/assets/trains/';
const SPEED = 5.0; // world-units per second

// Track ring positioned one tile outside the playable grid
const HALF_C = (MAP_COLS - 1) / 2; // 13.5
const HALF_R = (MAP_ROWS - 1) / 2; // 7.5
const MARGIN = 1.0;

const TN = -(HALF_R + MARGIN); // north z = -8.5
const TS =  (HALF_R + MARGIN); // south z =  8.5
const TW = -(HALF_C + MARGIN); // west  x = -14.5
const TE =  (HALF_C + MARGIN); // east  x =  14.5

// Clockwise loop: NW → NE → SE → SW → back to NW
const WAYPOINTS = [
  { x: TW, z: TN },
  { x: TE, z: TN },
  { x: TE, z: TS },
  { x: TW, z: TS },
] as const;

const loader = new GLTFLoader();

function loadGLB(url: string): Promise<THREE.Group> {
  return new Promise((res, rej) => {
    loader.load(url, gltf => {
      gltf.scene.traverse(n => {
        if (n instanceof THREE.Mesh) { n.castShadow = true; n.receiveShadow = true; }
      });
      res(gltf.scene);
    }, undefined, rej);
  });
}

// Straight track aligned with the X axis at a fixed Z
function addTrackX(scene: THREE.Scene, z: number, xMin: number, xMax: number): void {
  const railMat = new THREE.MeshLambertMaterial({ color: 0x888899 });
  const tieMat  = new THREE.MeshLambertMaterial({ color: 0x5a3e20 });
  const length  = xMax - xMin;
  const cx      = (xMin + xMax) / 2;
  const y       = GRASS_H + 0.02;

  for (const oz of [-0.18, 0.18]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.04, 0.05), railMat);
    rail.position.set(cx, y + 0.03, z + oz);
    scene.add(rail);
  }
  for (let x = xMin; x <= xMax; x += 0.8) {
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.52), tieMat);
    tie.position.set(x, y, z);
    scene.add(tie);
  }
}

// Straight track aligned with the Z axis at a fixed X
function addTrackZ(scene: THREE.Scene, x: number, zMin: number, zMax: number): void {
  const railMat = new THREE.MeshLambertMaterial({ color: 0x888899 });
  const tieMat  = new THREE.MeshLambertMaterial({ color: 0x5a3e20 });
  const length  = zMax - zMin;
  const cz      = (zMin + zMax) / 2;
  const y       = GRASS_H + 0.02;

  for (const ox of [-0.18, 0.18]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, length), railMat);
    rail.position.set(x + ox, y + 0.03, cz);
    scene.add(rail);
  }
  for (let z = zMin; z <= zMax; z += 0.8) {
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.05, 0.12), tieMat);
    tie.position.set(x, y, z);
    scene.add(tie);
  }
}

export class TrainDecor {
  private group:   THREE.Group;
  private wpIdx:   number = 0;
  private segDist: number = 0; // distance traveled along current segment (world units)

  private constructor(group: THREE.Group, scene: THREE.Scene) {
    this.group = group;
    group.position.set(TW, 0, TN);
    scene.add(group);

    addTrackX(scene, TN, TW, TE); // north
    addTrackX(scene, TS, TW, TE); // south
    addTrackZ(scene, TE, TN, TS); // east
    addTrackZ(scene, TW, TN, TS); // west
  }

  static async create(scene: THREE.Scene): Promise<TrainDecor> {
    const [loco, carBlue, carRed] = await Promise.all([
      loadGLB(TRAIN_BASE + 'train-locomotive-a.glb'),
      loadGLB(TRAIN_BASE + 'train-carriage-container-blue.glb'),
      loadGLB(TRAIN_BASE + 'train-carriage-container-red.glb'),
    ]);

    // Normalise to ~0.8-unit footprint
    for (const m of [loco, carBlue, carRed]) {
      const size = new THREE.Box3().setFromObject(m).getSize(new THREE.Vector3());
      const fp   = Math.max(size.x, size.z);
      if (fp > 0) m.scale.setScalar(0.8 / fp);
    }

    // Kenney models face -Z; carriages placed at +Z (behind the nose)
    loco.position.z    = 0;
    carBlue.position.z = 1.1;
    carRed.position.z  = 2.2;

    // Sit each model on the ground
    for (const m of [loco, carBlue, carRed]) {
      const box = new THREE.Box3().setFromObject(m);
      m.position.y = GRASS_H - box.min.y;
    }

    const group = new THREE.Group();
    group.add(loco, carBlue, carRed);
    return new TrainDecor(group, scene);
  }

  update(dt: number): void {
    this.segDist += SPEED * dt;

    // Advance to next waypoint if past end of current segment
    const wp0 = WAYPOINTS[this.wpIdx];
    const wp1 = WAYPOINTS[(this.wpIdx + 1) % WAYPOINTS.length];
    let dx = wp1.x - wp0.x;
    let dz = wp1.z - wp0.z;
    let segLen = Math.sqrt(dx * dx + dz * dz);

    if (this.segDist >= segLen) {
      this.segDist -= segLen;
      this.wpIdx = (this.wpIdx + 1) % WAYPOINTS.length;
      // Recalculate for new segment
      const nwp0 = WAYPOINTS[this.wpIdx];
      const nwp1 = WAYPOINTS[(this.wpIdx + 1) % WAYPOINTS.length];
      dx     = nwp1.x - nwp0.x;
      dz     = nwp1.z - nwp0.z;
      segLen = Math.sqrt(dx * dx + dz * dz);
    }

    const cur = WAYPOINTS[this.wpIdx];
    const t   = this.segDist / segLen;

    this.group.position.x = cur.x + dx * t;
    this.group.position.z = cur.z + dz * t;

    // -Z-facing models: group.rotation.y = atan2(-dx, -dz) faces direction (dx, dz)
    this.group.rotation.y = Math.atan2(-dx, -dz);
  }
}
