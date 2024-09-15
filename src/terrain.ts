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
  set width(value: number) {
    this._width = value;
  }
  get height() {
    return this._height;
  }
  set height(value: number) {
    this._height = value;
  }

  createGeometry() {
    this.geometry?.dispose();
    this.geometry = new PlaneGeometry(this._width, this._height);
    this.position.set(this._width / 2, 0, this._height / 2);
  }
}
