import { GameObject } from "../objects/GameObject";
import { Player } from "../players/Player";
import { Action } from "./Action";

export class RangedAttackAction extends Action<Player> {
  override name = "Ranged Attack";
  private _target: GameObject | null = null;
  private _max_distance = 5;

  override async perform(): Promise<void> {
    this._target?.hit(3 + Math.floor(Math.random() * 5));
  }

  override async canPerform(): Promise<boolean> {
    this._target = await this.source.getTargetObject();
    if (!this._target) return false;
    if (this._target === this.source) return false;
    const distance = this._target.coords
      .clone()
      .sub(this.source.coords)
      .length();
    // Target must be within the range
    if (distance > this._max_distance) return false;
    return true;
  }
}
