import {
  ConeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
} from "three";

export class Terrain extends Mesh {
  private _width: number;
  private _height: number;
  private _tree_count: number;
  private _terrain: Mesh<PlaneGeometry, MeshStandardMaterial> | undefined;
  private _trees: Group | undefined;

  constructor(width: number, height: number) {
    super();

    this._width = width;
    this._height = height;
    this._tree_count = 10;

    this.createTerrain();
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
  get terrain() {
    if (!this._terrain) throw Error("Terrain is not set");
    return this._terrain;
  }

  createTerrain() {
    if (this._terrain) {
      this._terrain.geometry.dispose();
      this._terrain.material.dispose();
    }
    const terrain_material = new MeshStandardMaterial({ color: 0x50a000 });
    const terrain_geometry = new PlaneGeometry(this._width, this._height);
    this._terrain = new Mesh(terrain_geometry, terrain_material);
    this._terrain.rotation.x = -Math.PI / 2;
    this._terrain.position.set(this._width / 2, 0, this._height / 2);
    this.add(this._terrain);
  }

  createTrees() {
    const tree_radius = 0.2;
    const tree_height = 1;

    const tree_geometry = new ConeGeometry(tree_radius, tree_height, 8);
    const tree_material = new MeshStandardMaterial({
      color: 0x305010,
      flatShading: true,
    });

    this._trees = new Group();
    this.add(this._trees);

    this._trees.clear();

    for (let i = 0; i < this._tree_count; i++) {
      const tree_mesh = new Mesh(tree_geometry, tree_material);
      tree_mesh.position.set(
        this._width * Math.random(),
        tree_height / 2,
        this._height * Math.random()
      );
      this._trees.add(tree_mesh);
    }
  }
}
