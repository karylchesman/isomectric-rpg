import { ConeGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { GameObject } from "./GameObject";

const TREE_GEOMETRY = new ConeGeometry(0.2, 1, 8);
const TREE_MATERIAL = new MeshStandardMaterial({
  color: 0x305010,
  flatShading: true,
});

export class Tree extends GameObject {
  constructor(coords: Vector3) {
    const tree_mesh = new Mesh(TREE_GEOMETRY, TREE_MATERIAL);
    tree_mesh.position.set(0.5, 0.5, 0.5);

    super(coords, tree_mesh);

    this.name = `Tree-(${coords.x},${coords.z})`;

    this.position.copy(coords);
  }
}
