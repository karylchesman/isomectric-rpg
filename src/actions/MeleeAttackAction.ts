import { GameObject } from "../objects/GameObject";
import { Player } from "../players/Player";
import { Action, TCanPerformResult } from "./Action";

export class MeleeAttackAction extends Action<Player> {
  override name = "Melee Attack";
  private _target: GameObject | null = null;

  override async perform(): Promise<void> {
    this._target?.hit(3 + Math.floor(Math.random() * 5));
  }

  override async canPerform(): Promise<TCanPerformResult> {
    this._target = await this.source.getTargetObject();

    if (!this._target)
      return {
        value: false,
        reason: "Must have a valid target",
      };

    if (this._target === this.source)
      return {
        value: false,
        reason: "Cannot target self",
      };

    const distance = this._target.coords
      .clone()
      .sub(this.source.coords)
      .length();
    if (distance > 1)
      return {
        value: false,
        reason: "Target is too far away",
      };

    return {
      value: true,
    };
  }
}
