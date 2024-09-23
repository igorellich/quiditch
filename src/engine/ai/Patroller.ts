import { ITargetPointer } from "../../quiditch/controls/ITargetPointer";
import { ITickable } from "../base/ITickable";
import { IZone } from "./zone/IZone";

export class Patroller<TPoint> implements ITickable{
    private readonly _targetPointer:ITargetPointer<TPoint>;
    private readonly _reachInterval: number;
    private readonly _zone:IZone<TPoint>;

    private _reachTime: number;
    constructor(zone: IZone<TPoint>, targetPointer:ITargetPointer<TPoint>, reachInterval: number){
        this._targetPointer = targetPointer;
        this._reachInterval = reachInterval;
        this._zone = zone;
        this._reachTime = reachInterval;
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        if (this._targetPointer.isTargetReached()) {
            if (this._reachTime >= this._reachInterval) {
                this._reachTime = 0;
                const newPoint = await this._zone.getRandomPoint();
                console.log(newPoint);
                this._targetPointer.setTargetPoint(newPoint);
            } else {
                this._reachTime += deltaTime;
            }
        }
    }

}