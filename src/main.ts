import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Terrain } from "./terrain";

const gui = new GUI();
const stats = new Stats();
document.body.querySelector("#app")!.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.querySelector("#app")!.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 2, 10);

const terrain = new Terrain(10, 10);
scene.add(terrain);

const sun = new THREE.DirectionalLight();
sun.intensity = 3;
sun.position.set(1, 2, 3);
scene.add(sun);

const ambient = new THREE.AmbientLight();
ambient.intensity = 0.5;
scene.add(ambient);

const controls = new OrbitControls(camera, renderer.domElement);
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

const terrain_folder = gui.addFolder("Terrain");
terrain_folder.add(terrain, "width", 1, 20, 1).name("Width");
terrain_folder.add(terrain, "height", 1, 20, 1).name("Height");
terrain_folder.addColor(terrain.terrain.material, "color").name("Color");
terrain_folder.onChange(() => {
  terrain.createTerrain();
});
