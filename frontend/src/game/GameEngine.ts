import * as THREE from 'three';

export class GameEngine {
  readonly scene:    THREE.Scene;
  readonly camera:   THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;

  private clock     = new THREE.Clock();
  private callbacks: Array<(dt: number) => void> = [];

  constructor(container: HTMLElement) {
    this.scene            = new THREE.Scene();
    this.scene.background = new THREE.Color(0x6ab0d4);
    this.scene.fog = new THREE.Fog(0x6ab0d4, 14, 30);

    const W = window.innerWidth;
    const H = window.innerHeight;

    // 3/4 overhead — position driven by GameLoop camera follow
    this.camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 100);
    this.camera.position.set(0, 11, 8.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(W, H);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled        = true;
    this.renderer.shadowMap.type           = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping              = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure      = 0.92;
    container.appendChild(this.renderer.domElement);

    // Warm sky / green ground hemisphere
    this.scene.add(new THREE.HemisphereLight(0xb4d8f5, 0x4a7c40, 0.80));

    // Golden-hour sun from south-west
    const sun = new THREE.DirectionalLight(0xffeebb, 1.4);
    sun.position.set(-5, 16, 12);
    sun.castShadow           = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left   = -22;
    sun.shadow.camera.right  =  22;
    sun.shadow.camera.top    =  18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.camera.near   =  0.5;
    sun.shadow.camera.far    =  50;
    sun.shadow.bias          = -0.0008;
    this.scene.add(sun);

    // Cool blue fill from north-east
    const fill = new THREE.DirectionalLight(0x99bbdd, 0.45);
    fill.position.set(8, 10, -6);
    this.scene.add(fill);

    // Ground base plane (extends beyond the tile grid)
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x3a5230 });
    const ground    = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.02;
    ground.receiveShadow = true;
    this.scene.add(ground);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.startLoop();
  }

  onUpdate(cb: (dt: number) => void): void {
    this.callbacks.push(cb);
  }

  private startLoop(): void {
    const tick = () => {
      const dt = this.clock.getDelta();
      for (const cb of this.callbacks) cb(dt);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
