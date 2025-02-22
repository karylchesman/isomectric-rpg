import { Mesh, MeshStandardMaterial, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { getModelPath } from "../utils";
import { GameObject } from "./GameObject";

const loader = new GLTFLoader();

const TREE_MATERIAL = new MeshStandardMaterial({
  color: 0x305010,
  flatShading: true,
});

export class Tree extends GameObject {
  constructor(coords: Vector3) {
    super(coords, new Mesh());

    this.name = `Tree-(${coords.x},${coords.z})`;

    loader.load(getModelPath(`tree1`), (tree_model) => {
      const variation = new Vector3(0.1, 0.3, 0.1);
      // @ts-ignore
      this.mesh.add(tree_model.scene.children[0]);
      this.mesh.scale.set(
        1.0 + 2.0 * variation.x * (Math.random() - 0.5),
        1.0 + 2.0 * variation.y * (Math.random() - 0.5),
        1.0 + 2.0 * variation.z * (Math.random() - 0.5)
      );
      this.mesh.rotation.set(0, Math.random() * 2 * Math.PI, 0);
      this.mesh.position.set(0.5, 0, 0.5);
      this.mesh.material = TREE_MATERIAL;
    });
  }
}
