import { Mesh, MeshStandardMaterial, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { getModelPath } from "../utils";
import { GameObject } from "./GameObject";

const loader = new GLTFLoader();

const ROCK_MATERIAL = new MeshStandardMaterial({
  color: 0xb0b0b0,
  flatShading: true,
});

export class Rock extends GameObject {
  constructor(coords: Vector3) {
    super(coords, new Mesh());

    this.name = `Rock-(${coords.x},${coords.z})`;

    const index = Math.floor(Math.random() * 3) + 1;
    loader.load(getModelPath(`rock${index}`), (rock_model) => {
      const variation = new Vector3(0.5, 0.3, 0.5);
      // @ts-ignore
      this.mesh.geometry = rock_model.scene.children[0].geometry;
      this.mesh.scale.set(
        1.0 + 2.0 * variation.x * (Math.random() - 0.5),
        1.0 + 2.0 * variation.y * (Math.random() - 0.5),
        1.0 + 2.0 * variation.z * (Math.random() - 0.5)
      );
      this.mesh.rotation.set(0, Math.random() * 2 * Math.PI, 0);
      this.mesh.position.set(0.5, 0, 0.5);
      this.mesh.material = ROCK_MATERIAL;
    });
  }
}
