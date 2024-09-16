import { ConeGeometry, Mesh, MeshStandardMaterial, PlaneGeometry } from "three";

export class Terrain extends Mesh<PlaneGeometry, MeshStandardMaterial> {
  private _width: number;
  private _height: number;
  private _tree_count: number;

  constructor(width: number, height: number) {
    super();

    this._width = width;
    this._height = height;
    this._tree_count = 10;

    this.createGeometry();
    this.material = new MeshStandardMaterial({ color: 0x50a000 });

    this.rotation.x = -Math.PI / 2;

    this.createTrees();
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
  get tree_count() {
    return this._tree_count;
  }
  set tree_count(value: number) {
    this._tree_count = value;
  }

  createGeometry() {
    this.geometry?.dispose();
    this.geometry = new PlaneGeometry(this._width, this._height);
    this.position.set(this._width / 2, 0, this._height / 2);
  }

  createTrees() {
    const tree_radius = 0.2;
    const tree_height = 1;
    for (let i = 0; i < this._tree_count; i++) {
      const tree_geometry = new ConeGeometry(tree_radius, tree_height, 8);
      const tree_material = new MeshStandardMaterial({
        color: 0x305010,
        flatShading: true,
      });
      const tree_mesh = new Mesh(tree_geometry, tree_material);
      tree_mesh.rotation.x = Math.PI / 2;
      tree_mesh.position.z = tree_height / 2;
      this.add(tree_mesh);
    }
  }
}
