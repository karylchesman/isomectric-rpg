import { Group, Mesh, Sprite, Vector3 } from "three";
import { createTextMaterial } from "../utils";

export class GameObject extends Group {
  mesh: Mesh;
  coords: Vector3;
  private _hit_points: number = 10;
  private _max_hit_points: number = 10;
  protected _health_overlay: Sprite;

  onMove:
    | ((object: GameObject, old_coords: Vector3, new_coords: Vector3) => void)
    | null = null;

  constructor(coords: Vector3, mesh: Mesh) {
    super();

    this.coords = coords;
    this.position.copy(coords);

    this.mesh = mesh;
    this.add(mesh);

    this._health_overlay = new Sprite();
    this._health_overlay.position.set(0.5, 1.2, 0.5);
    this._health_overlay.visible = false;
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
    const old_coordinates = this.coords;
    this.coords = coords;
    this.position.copy(coords);

    this.onMove?.(this, old_coordinates, this.coords);
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
