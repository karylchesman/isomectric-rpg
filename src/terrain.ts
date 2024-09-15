import { Mesh, MeshStandardMaterial, PlaneGeometry } from "three";

export class Terrain extends Mesh<PlaneGeometry, MeshStandardMaterial> {
  private _width: number;
  private _height: number;

  constructor(width: number, height: number) {
    super();

    this._width = width;
    this._height = height;

    this.createGeometry();
    this.material = new MeshStandardMaterial({ color: 0x50a000 });

    this.rotation.x = -Math.PI / 2;
  }

  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }

  createGeometry() {
    this.geometry?.dispose();
    this.geometry = new PlaneGeometry(this._width, this._height);
  }
}
