import { ConeGeometry, MeshStandardMaterial, Vector3 } from "three";
import { GameObject } from "./GameObject";

const TREE_GEOMETRY = new ConeGeometry(0.2, 1, 8);
const TREE_MATERIAL = new MeshStandardMaterial({
  color: 0x305010,
  flatShading: true,
});

export class Tree extends GameObject {
  constructor(coords: Vector3) {
    super(coords, TREE_GEOMETRY, TREE_MATERIAL);

    this.name = `Tree-(${coords.x},${coords.y})`;

    this.position.set(coords.x + 0.5, coords.y + 0.5, coords.z + 0.5);
  }
}
