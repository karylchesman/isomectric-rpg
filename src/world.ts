import {
  BoxGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
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
import { HumanPlayer } from "./players/HumanPlayer";

const texture_loader = new TextureLoader();
const grid_texture = texture_loader.load("../public/textures/grid.png");

export type TTerrain = Mesh<PlaneGeometry, MeshStandardMaterial>;

export class World extends Group {
  #object_map = new Map();

  path: Group;

  private _width: number;
  private _height: number;
  private _tree_count: number;
  private _rock_count: number;
  private _bush_count: number;

  private _objects: Group;
  private _props: Group;
  private _players: Group;
  private _terrain: TTerrain | undefined;

  constructor(width: number, height: number, camera: PerspectiveCamera) {
    super();

    this._width = width;
    this._height = height;
    this._tree_count = 10;
    this._rock_count = 20;
    this._bush_count = 10;

    this._objects = new Group();
    this.add(this._objects);

    this._players = new Group();
    this._objects.add(this._players);

    this._props = new Group();
    this._objects.add(this._props);

    this.path = new Group();
    this.add(this.path);

    this.generate(camera);
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
  get players() {
    return this._players;
  }
  get objects() {
    return this._objects;
  }

  generate(camera: PerspectiveCamera) {
    this.clearWorld();

    const player1 = new HumanPlayer(new Vector3(1, 0, 5), camera, this);
    player1.name = "Player 1";
    this.addObject(player1, "players");

    const player2 = new HumanPlayer(new Vector3(8, 0, 3), camera, this);
    player2.name = "Player 2";
    this.addObject(player2, "players");

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

    this._players.clear();
    this._props.clear();
    this.#object_map.clear();
  }

  createTerrain() {
    grid_texture.repeat = new Vector2(this._width, this._height);
    grid_texture.wrapS = RepeatWrapping;
    grid_texture.wrapT = RepeatWrapping;
    grid_texture.colorSpace = SRGBColorSpace;

    const terrain_material = new MeshStandardMaterial({ map: grid_texture });
    const terrain_geometry = new BoxGeometry(this.width, 0.1, this.height);
    this._terrain = new Mesh(terrain_geometry, terrain_material);
    this._terrain.name = "Terrain";
    this._terrain.position.set(this._width / 2, -0.05, this._height / 2);
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
      this.addObject(tree, "props");
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
      this.addObject(rock, "props");
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
      this.addObject(bush, "props");
    }
  }

  /**
   * Adds an object to the world at the specified coordinates unless
   * an object already exists at those coordinates
   */
  addObject(object: GameObject, group: "players" | "props") {
    if (this.#object_map.has(getObjectMapKey(object.coords))) return false;

    switch (group) {
      case "players":
        this._players.add(object);
        break;
      case "props":
        this._props.add(object);
        break;
    }

    object.onMove = (object, old_coords, new_coords) => {
      console.log("onMove", object, old_coords, new_coords);
      this.#object_map.delete(getObjectMapKey(old_coords));
      this.#object_map.set(getObjectMapKey(new_coords), object);
    };
    this.#object_map.set(getObjectMapKey(object.coords), object);
    return true;
  }

  /**
   * Returns the object at `coords` if one exists, otherwise returns null
   */
  getObject(coords: Vector3): Mesh | null {
    return this.#object_map.get(getObjectMapKey(coords)) ?? null;
  }
}
