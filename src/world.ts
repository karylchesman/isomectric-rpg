import {
  ConeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
} from "three";

export class World extends Mesh {
  private _width: number;
  private _height: number;
  private _terrain: Mesh<PlaneGeometry, MeshStandardMaterial> | undefined;
  private _tree_count: number;
  private _trees: Group | undefined;
  private _rock_count: number;
  private _rocks: Group | undefined;
  private _bush_count: number;
  private _bushes: Group | undefined;

  constructor(width: number, height: number) {
    super();

    this._width = width;
    this._height = height;
    this._tree_count = 10;
    this._rock_count = 20;
    this._bush_count = 10;

    this.createTerrain();
    this.createTrees();
    this.createRocks();
    this.createBushes();
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
      this.remove(this._terrain);
    }
    const terrain_material = new MeshStandardMaterial({
      color: 0x50a000,
    });
    const terrain_geometry = new PlaneGeometry(
      this._width,
      this._height,
      this._width,
      this._height
    );
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
        Math.floor(this._width * Math.random()) + 0.5,
        tree_height / 2,
        Math.floor(this._height * Math.random()) + 0.5
      );
      this._trees.add(tree_mesh);
    }
  }

  createRocks() {
    const min_rock_radius = 0.1;
    const max_rock_radius = 0.3;
    const min_rock_height = 0.5;
    const max_rock_height = 0.8;

    const rock_material = new MeshStandardMaterial({
      color: 0xb0b0b0,
      flatShading: true,
    });

    this._rocks = new Group();
    this.add(this._rocks);

    this._rocks.clear();

    for (let i = 0; i < this._rock_count; i++) {
      const radius =
        min_rock_radius + Math.random() * (max_rock_radius - min_rock_radius);
      const height =
        min_rock_height + Math.random() * (max_rock_height - min_rock_height);
      const rock_geometry = new SphereGeometry(radius, 6, 5);
      const rock_mesh = new Mesh(rock_geometry, rock_material);
      rock_mesh.position.set(
        Math.floor(this._width * Math.random()) + 0.5,
        0,
        Math.floor(this._height * Math.random()) + 0.5
      );
      rock_mesh.scale.y = height;
      this._rocks.add(rock_mesh);
    }
  }

  createBushes() {
    const min_bush_radius = 0.1;
    const max_bush_radius = 0.3;

    const bush_material = new MeshStandardMaterial({
      color: 0x80a040,
      flatShading: true,
    });

    this._bushes = new Group();
    this.add(this._bushes);

    this._bushes.clear();

    for (let i = 0; i < this._bush_count; i++) {
      const radius =
        min_bush_radius + Math.random() * (max_bush_radius - min_bush_radius);
      const bush_geometry = new SphereGeometry(radius, 8, 8);
      const bush_mesh = new Mesh(bush_geometry, bush_material);
      bush_mesh.position.set(
        Math.floor(this._width * Math.random()) + 0.5,
        radius,
        Math.floor(this._height * Math.random()) + 0.5
      );
      this._bushes.add(bush_mesh);
    }
  }
}
