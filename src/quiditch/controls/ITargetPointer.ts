import { IActor } from "../../engine/base/Actor/IActor";

export interface ITargetPointer<TPoint>{
    setTargetPoint(point?:TPoint):void;
    isTargetReached(): boolean;

    getActor():IActor|undefined;
   
    setTargetAngle(angle: number):void;
}