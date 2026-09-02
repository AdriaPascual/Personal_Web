import * as THREE from 'three';
import { gridToWorld, GRASS_H } from '../constants3D';

const trunkGeo = new THREE.CylinderGeometry(0.04, 0.07, 0.38, 6);
const leafGeoA  = new THREE.ConeGeometry(0.30, 0.62, 7);
const leafGeoB  = new THREE.ConeGeometry(0.24, 0.50, 7);
const trunkMat = new THREE.MeshLambertMaterial({ color: 0x7a5030 });
const leafMatA  = new THREE.MeshLambertMaterial({ color: 0x2e7d32 });
const leafMatB  = new THREE.MeshLambertMaterial({ color: 0x388e3c });

const postGeo  = new THREE.CylinderGeometry(0.03, 0.04, 1.2, 6);
const globeGeo = new THREE.SphereGeometry(0.09, 8, 6);
const postMat  = new THREE.MeshLambertMaterial({ color: 0x555566 });
const globeMat = new THREE.MeshLambertMaterial({ color: 0xffffc0, emissive: new THREE.Color(0xffffc0), emissiveIntensity: 0.8 });

const fuzz = (c: number, r: number, k = 0) =>
  (Math.sin(c * 13.7 + r * 7.3 + k * 31.1) * 0.5 + 0.5);

function makeTree(scene: THREE.Scene, col: number, row: number): void {
  const { x, z } = gridToWorld(col, row);
  const ox = (fuzz(col, row, 0) - 0.5) * 0.5;
  const oz = (fuzz(col, row, 1) - 0.5) * 0.5;
  const h  = 0.55 + fuzz(col, row, 2) * 0.4;

  const g = new THREE.Group();

  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = GRASS_H + 0.19;
  trunk.castShadow = true;
  g.add(trunk);

  const lA = new THREE.Mesh(leafGeoA, col % 2 === 0 ? leafMatA : leafMatB);
  lA.position.y = GRASS_H + 0.38 + h * 0.5;
  lA.castShadow = true;
  g.add(lA);

  const lB = new THREE.Mesh(leafGeoB, col % 2 === 0 ? leafMatB : leafMatA);
  lB.position.y = GRASS_H + 0.38 + h * 0.8;
  lB.castShadow = true;
  g.add(lB);

  g.position.set(x + ox, 0, z + oz);
  scene.add(g);
}

function makeLamp(scene: THREE.Scene, col: number, row: number): void {
  const { x, z } = gridToWorld(col, row);
  const g = new THREE.Group();

  const post = new THREE.Mesh(postGeo, postMat);
  post.position.y = GRASS_H + 0.6;
  post.castShadow = true;
  g.add(post);

  const globe = new THREE.Mesh(globeGeo, globeMat);
  globe.position.y = GRASS_H + 1.25;
  g.add(globe);

  const pl = new THREE.PointLight(0xffffc0, 0.6, 2.5);
  pl.position.y = GRASS_H + 1.25;
  g.add(pl);

  g.position.set(x, 0, z);
  scene.add(g);
}

export function addDecor(scene: THREE.Scene): void {
  // ── Inner grass blocks between streets (rows 4-6 and 8-10, cols 4-6 / 8-10 / 12-14 / 16-18 / 20-22) ──
  const innerBlocks: [number, number][] = [
    // Band 1 (rows 4-6)
    [4,4],[6,4],[4,5],[6,5],[4,6],[6,6],
    [8,4],[10,4],[8,5],[10,5],[8,6],[10,6],
    [12,4],[14,4],[12,5],[14,5],[12,6],[14,6],
    [16,4],[18,4],[16,5],[18,5],[16,6],[18,6],
    [20,4],[22,4],[20,5],[22,5],[20,6],[22,6],
    // Band 2 (rows 8-10)
    [4,8],[6,8],[4,9],[6,9],[4,10],[6,10],
    [8,8],[10,8],[8,9],[10,9],[8,10],[10,10],
    [12,8],[14,8],[12,9],[14,9],[12,10],[14,10],
    [16,8],[18,8],[16,9],[18,9],[16,10],[18,10],
    [20,8],[22,8],[20,9],[22,9],[20,10],[22,10],
  ];
  for (const [c, r] of innerBlocks) makeTree(scene, c, r);

  // ── Outer edge trees (north rows 0-2, south rows 12-15, west cols 0-2, east cols 24-27) ──
  const outerTrees: [number, number][] = [
    // North
    [0,0],[2,0],[4,0],[6,0],[8,0],[10,0],[12,0],[14,0],[16,0],[18,0],[20,0],[22,0],[24,0],[26,0],
    [1,1],[5,1],[9,1],[13,1],[17,1],[21,1],[25,1],
    [0,2],[2,2],[4,2],[6,2],[8,2],[10,2],[12,2],[14,2],[16,2],[18,2],[20,2],[22,2],[24,2],[26,2],
    // South
    [0,12],[2,12],[4,12],[6,12],[8,12],[10,12],[12,12],[14,12],[16,12],[18,12],[20,12],[22,12],[24,12],[26,12],
    [1,13],[5,13],[9,13],[13,13],[17,13],[21,13],[25,13],
    [0,14],[2,14],[4,14],[6,14],[8,14],[10,14],[12,14],[14,14],[16,14],[18,14],[20,14],[22,14],[24,14],[26,14],
    [1,15],[6,15],[12,15],[18,15],[24,15],[27,15],
    // West
    [0,4],[0,5],[0,6],[1,4],[1,6],
    [0,8],[0,9],[0,10],[1,8],[1,10],
    [2,5],[2,9],
    // East
    [24,4],[26,4],[24,5],[25,5],[27,4],
    [24,8],[26,8],[24,9],[25,9],[27,8],
    [25,6],[27,6],[25,10],[27,10],
  ];
  for (const [c, r] of outerTrees) makeTree(scene, c, r);

  // ── Street lamps at building intersection corners ──────────────
  const lamps: [number, number][] = [
    [2.5,2.5],[3.5,2.5],[2.5,3.5],[3.5,3.5],         // About (3,3)
    [10.5,2.5],[11.5,2.5],[10.5,3.5],[11.5,3.5],      // CV (11,3)
    [22.5,2.5],[23.5,2.5],[22.5,3.5],[23.5,3.5],      // LinkedIn (23,3)
    [2.5,10.5],[3.5,10.5],[2.5,11.5],[3.5,11.5],      // Contact (3,11)
    [10.5,10.5],[11.5,10.5],[10.5,11.5],[11.5,11.5],  // Projects (11,11)
    [22.5,10.5],[23.5,10.5],[22.5,11.5],[23.5,11.5],  // Unlimioo (23,11)
    [14.5,6.5],[15.5,6.5],[14.5,7.5],[15.5,7.5],      // Articles (15,7)
  ];
  for (const [c, r] of lamps) makeLamp(scene, c, r);
}
