import {
  Group,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
} from "three";
import { Bush } from "./objects/Bush";
import { GameObject } from "./objects/GameObject";
import { Rock } from "./objects/Rock";
import { Tree } from "./objects/Tree";
import { getObjectMapKey } from "./utils";

const texture_loader = new TextureLoader();
const grid_texture = texture_loader.load("../public/textures/grid.png");

export type TTerrain = Mesh<PlaneGeometry, MeshStandardMaterial>;

export class World extends Group {
  #object_map = new Map();

  path: Group;

  private _width: number;
  private _height: number;
  private _terrain: TTerrain | undefined;
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

    this.path = new Group();
    this.add(this.path);

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

    this._trees.clear();
    this._rocks.clear();
    this._bushes.clear();

    this.#object_map.clear();
  }

  createTerrain() {
    grid_texture.repeat = new Vector2(this._width, this._height);
    grid_texture.wrapS = RepeatWrapping;
    grid_texture.wrapT = RepeatWrapping;
    grid_texture.colorSpace = SRGBColorSpace;

    const terrain_material = new MeshStandardMaterial({ map: grid_texture });
    const terrain_geometry = new PlaneGeometry(
      this._width,
      this._height,
      this._width,
      this._height
    );
    this._terrain = new Mesh(terrain_geometry, terrain_material);
    this._terrain.name = "Terrain";
    this._terrain.rotation.x = -Math.PI / 2;
    this._terrain.position.set(this._width / 2, 0, this._height / 2);
    this.add(this._terrain);
  }

  createTrees() {
    for (let i = 0; i < this._tree_count; i++) {
      const coords = new Vector3(
        Math.floor(this._width * Math.random()),
        0,
        Math.floor(this._height * Math.random())
      );
      const tree = new Tree(coords);
      this.addObject(tree, coords, this._trees);
    }
  }

  createRocks() {
    for (let i = 0; i < this._rock_count; i++) {
      const coords = new Vector3(
        Math.floor(this._width * Math.random()),
        0,
        Math.floor(this._height * Math.random())
      );
      const rock = new Rock(coords);
      this.addObject(rock, coords, this._rocks);
    }
  }

  createBushes() {
    for (let i = 0; i < this._bush_count; i++) {
      const coords = new Vector3(
        Math.floor(this._width * Math.random()),
        0,
        Math.floor(this._height * Math.random())
      );
      const bush = new Bush(coords);
      this.addObject(bush, coords, this._bushes);
    }
  }

  /**
   * Adds an object to the world at the specified coordinates unless
   * an object already exists at those coordinates
   */
  addObject(object: GameObject, coords: Vector3, group: Group) {
    if (this.#object_map.has(getObjectMapKey(coords))) return false;
    group.add(object);
    this.#object_map.set(getObjectMapKey(coords), object);
    return true;
  }

  /**
   * Returns the object at `coords` if one exists, otherwise returns null
   */
  getObject(coords: Vector3): Mesh | null {
    return this.#object_map.get(getObjectMapKey(coords)) ?? null;
  }
}
