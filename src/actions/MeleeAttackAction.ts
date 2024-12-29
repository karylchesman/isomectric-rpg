import { GameObject } from "../objects/GameObject";
import { Player } from "../players/Player";
import { Action } from "./Action";

export class MeleeAttackAction extends Action<Player> {
  override name = "Melee Attack";
  private _target: GameObject | null = null;

  override async perform(): Promise<void> {
    this._target?.hit(Math.floor(Math.random() * 5));
  }

  override async canPerform(): Promise<boolean> {
    this._target = await this.source.getTargetObject();
    console.log("canPerform", this._target);
    if (!this._target) return false;
    if (this._target === this.source) return false;
    const distance = this._target.coords
      .clone()
      .sub(this.source.coords)
      .length();
    if (distance > 1) return false;
    return true;
  }
}
