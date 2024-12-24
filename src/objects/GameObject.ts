import { BufferGeometry, Material, Mesh, Sprite, Vector3 } from "three";
import { createTextMaterial } from "../utils";

export class GameObject extends Mesh {
  coords: Vector3;
  private _hit_points: number = 10;
  private _max_hit_points: number = 10;
  private _health_overlay: Sprite;

  constructor(coords: Vector3, geometry: BufferGeometry, material: Material) {
    super(geometry, material);
    this.coords = coords;

    this._health_overlay = new Sprite();
    this._health_overlay.position.y = 0.75;
    this.add(this._health_overlay);

    this.updateHitPointOverlay();
  }

  get hit_points() {
    return this._hit_points;
  }
  get max_hit_points() {
    return this._max_hit_points;
  }
  get is_dead() {
    return this._hit_points === 0;
  }

  hit(damage: number) {
    this._hit_points -= damage;
    if (this._hit_points < 0) {
      this._hit_points = 0;
    }
    this.updateHitPointOverlay();
  }

  moveTo(coords: Vector3) {
    this.coords = coords;
    this.position.set(
      this.coords.x + 0.5,
      this.coords.y + 0.5,
      this.coords.z + 0.5
    );
  }

  updateHitPointOverlay() {
    if (this._health_overlay.material) {
      this._health_overlay.material.dispose();
    }
    this._health_overlay.material = createTextMaterial(
      `${this._hit_points}/${this.max_hit_points}`
    );
  }
}
