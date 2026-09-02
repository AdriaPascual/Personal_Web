import './style.css';
import { GameEngine } from './game/GameEngine';
import { GameLoop } from './game/GameLoop';
import { preloadAssets } from './game/world/AssetLoader';
import { applyToDOM } from './i18n';

applyToDOM();

const container = document.getElementById('game-container')!;
const loading   = document.getElementById('loading')!;
const engine    = new GameEngine(container);

preloadAssets()
  .then(() => {
    loading.style.display = 'none';
    new GameLoop(engine);
  })
  .catch((err: unknown) => {
    loading.textContent = 'Error al cargar. Recarga la página.';
    console.error(err);
  });
