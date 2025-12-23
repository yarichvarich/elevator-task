import { BaseEffectData } from "../../core/data/baseEffectData";
import type { Callback } from "../../core/type/callback";
import type { Passenger } from "../../core/type/floorQueue";
import type { PassengerWidget } from "../component/floors/view/passenger";

export class SpawnData extends BaseEffectData {
  public passenger: Passenger;
  public queuePosition: number;
  public view?: PassengerWidget;

  constructor(
    passenger: Passenger,
    queuePosition: number,
    callback?: Callback<void>
  ) {
    super(callback);

    this.passenger = passenger;
    this.queuePosition = queuePosition;
  }
}
