import { GameInputActions } from "../../../quiditch/constants";
import { ITargetPointer } from "../../../quiditch/controls/ITargetPointer";
import { IActor } from "../../base/Actor/IActor";
import { ITickable } from "../../base/ITickable";
import { IZone } from "../zone/IZone";

export class Patroller<TPoint> implements ITickable{
    protected readonly _targetPointer:ITargetPointer<TPoint, GameInputActions, IActor>;
    private readonly _reachInterval: number;
    protected readonly _zone:IZone<TPoint>;

    private _patrolling: boolean = false;

    getActor(){
        return this._targetPointer.getActor();
    }

    public setPatrolling(patrolling: boolean): void{
        this._patrolling = patrolling;
        // if(!patrolling){
        //     this._targetPointer.setTargetPoint(undefined);
        // }
    }

    private _reachTime: number;
    constructor(zone: IZone<TPoint>, targetPointer:ITargetPointer<TPoint, GameInputActions, IActor>, reachInterval: number){
        this._targetPointer = targetPointer;
        this._reachInterval = reachInterval;
        this._zone = zone;
        this._reachTime = reachInterval;
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        if (this._patrolling && this._targetPointer.isTargetReached()) {
            if (this._reachTime >= this._reachInterval) {
                this._reachTime = 0;
                const newPoint = await this._zone.getRandomPoint();
                console.log(newPoint);
                await this._targetPointer.setTargetPoint(newPoint);
            } else {
                this._reachTime += deltaTime;
            }
        }
    }

}