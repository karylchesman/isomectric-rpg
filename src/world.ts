import {
  ConeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  Vector2,
} from "three";

export class World extends Mesh {
  #object_map = new Map();

  private _width: number;
  private _height: number;
  private _terrain: Mesh<PlaneGeometry, MeshStandardMaterial> | undefined;
  private _tree_count: number;
  private _trees: Group;
  private _rock_count: number;
  private _rocks: Group;
  private _bush_count: number;
  private _bushes: Group;

  constructor(width: number, height: number) {
    super();

    this._width = width;
    this._height = height;
    this._tree_count = 10;
    this._rock_count = 20;
    this._bush_count = 10;
    this._trees = new Group();
    this.add(this._trees);
    this._rocks = new Group();
    this.add(this._rocks);
    this._bushes = new Group();
    this.add(this._bushes);

    this.generate();
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
  get terrain() {
    if (!this._terrain) throw Error("Terrain is not set");
    return this._terrain;
  }
  get tree_count() {
    return this._tree_count;
  }
  set tree_count(value: number) {
    this._tree_count = value;
  }
  get rock_count() {
    return this._rock_count;
  }
  set rock_count(value: number) {
    this._rock_count = value;
  }
  get bush_count() {
    return this._bush_count;
  }
  set bush_count(value: number) {
    this._bush_count = value;
  }

  generate() {
    this.clearWorld();
    this.createTerrain();
    this.createTrees();
    this.createRocks();
    this.createBushes();
  }

  clearWorld() {
    if (this._terrain) {
      this._terrain.geometry.dispose();
      this._terrain.material.dispose();
      this.remove(this._terrain);
    }
    if (this._trees) {
      this._trees.children.forEach((tree) => {
        if (!(tree instanceof Mesh)) return;
        tree.geometry?.dispose();
        tree.material?.dispose();
      });
      this._trees.clear();
    }
    if (this._rocks) {
      this._trees.children.forEach((rock) => {
        if (!(rock instanceof Mesh)) return;
        rock.geometry?.dispose();
        rock.material?.dispose();
      });
      this._rocks.clear();
    }
    if (this._bushes) {
      this._bushes.children.forEach((bush) => {
        if (!(bush instanceof Mesh)) return;
        bush.geometry?.dispose();
        bush.material?.dispose();
      });
      this._bushes.clear();
    }
    this.#object_map.clear();
  }

  createTerrain() {
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

    for (let i = 0; i < this._tree_count; i++) {
      const tree_mesh = new Mesh(tree_geometry, tree_material);
      const coords = new Vector2(
        Math.floor(this._width * Math.random()),
        Math.floor(this._height * Math.random())
      );
      if (this.#object_map.has(`${coords.x}-${coords.y}`)) continue;
      tree_mesh.position.set(coords.x + 0.5, tree_height / 2, coords.y + 0.5);
      this._trees.add(tree_mesh);
      this.#object_map.set(`${coords.x}-${coords.y}`, tree_mesh);
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

    for (let i = 0; i < this._rock_count; i++) {
      const radius =
        min_rock_radius + Math.random() * (max_rock_radius - min_rock_radius);
      const height =
        min_rock_height + Math.random() * (max_rock_height - min_rock_height);
      const rock_geometry = new SphereGeometry(radius, 6, 5);
      const rock_mesh = new Mesh(rock_geometry, rock_material);
      const coords = new Vector2(
        Math.floor(this._width * Math.random()),
        Math.floor(this._height * Math.random())
      );
      if (this.#object_map.has(`${coords.x}-${coords.y}`)) continue;
      rock_mesh.position.set(coords.x + 0.5, 0, coords.y + 0.5);
      rock_mesh.scale.y = height;
      this._rocks.add(rock_mesh);
      this.#object_map.set(`${coords.x}-${coords.y}`, rock_mesh);
    }
  }

  createBushes() {
    const min_bush_radius = 0.1;
    const max_bush_radius = 0.3;

    const bush_material = new MeshStandardMaterial({
      color: 0x80a040,
      flatShading: true,
    });

    for (let i = 0; i < this._bush_count; i++) {
      const radius =
        min_bush_radius + Math.random() * (max_bush_radius - min_bush_radius);
      const bush_geometry = new SphereGeometry(radius, 8, 8);
      const bush_mesh = new Mesh(bush_geometry, bush_material);
      const coords = new Vector2(
        Math.floor(this._width * Math.random()),
        Math.floor(this._height * Math.random())
      );
      if (this.#object_map.has(`${coords.x}-${coords.y}`)) continue;
      bush_mesh.position.set(coords.x + 0.5, radius, coords.y + 0.5);
      this._bushes.add(bush_mesh);
      this.#object_map.set(`${coords.x}-${coords.y}`, bush_mesh);
    }
  }
}
