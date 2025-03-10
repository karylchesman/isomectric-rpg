import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";
import { CombatManager } from "./CombatManager";
import { World } from "./world";
import { inputManager } from "./InputManager";

const gui = new GUI();
const stats = new Stats();
document.body.querySelector("#app")!.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x80b0ff);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(devicePixelRatio);
document.body.querySelector("#app")!.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x80b0ff, 10, 30);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 0);
camera.layers.enable(1);

const world = new World(10, 10);
scene.add(world);

inputManager.initialize(world, camera);
const combat_manager = new CombatManager();

const sun = new THREE.DirectionalLight();
sun.intensity = 3;
sun.position.set(1, 2, 3);
scene.add(sun);

const ambient = new THREE.AmbientLight();
ambient.intensity = 0.5;
scene.add(ambient);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(5, 0, 5);
controls.update();

function animate() {
  controls.update();
  renderer.render(scene, camera);
  stats.update();
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const world_folder = gui.addFolder("World");
world_folder.add(world, "width", 1, 20, 1).name("Width");
world_folder.add(world, "height", 1, 20, 1).name("Height");
world_folder.add(world, "tree_count", 1, 100, 1).name("Tree Count");
world_folder.add(world, "rock_count", 1, 100, 1).name("Rock Count");
world_folder.add(world, "bush_count", 1, 100, 1).name("Bush Count");
world_folder.add(world, "generate").name("Generate");

combat_manager.takeTurns(world);
