import { GameObject } from "../objects/GameObject";
import { Player } from "../players/Player";
import { Action, TCanPerformResult } from "./Action";

export class RangedAttackAction extends Action<Player> {
  override name = "Ranged Attack";
  private _target: GameObject | null = null;
  private _max_distance = 5;

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
    if (distance > this._max_distance)
      return {
        value: false,
        reason: "Target is too far away",
      };

    return {
      value: true,
    };
  }
}
