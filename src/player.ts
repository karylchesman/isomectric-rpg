import { CapsuleGeometry, Mesh, MeshStandardMaterial } from "three";

export class Player extends Mesh {
  constructor() {
    super();
    this.geometry = new CapsuleGeometry(0.25, 0.5);
    this.material = new MeshStandardMaterial({ color: 0x4040c0 });
    this.position.set(5.5, 0.5, 5.5);
  }
}
