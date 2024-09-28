import { IActor } from "../../engine/base/Actor/IActor";
import { ActorController } from "../../engine/controls/ActorController";

export interface ITargetPointer<TPoint, TGameActions, TActor extends IActor>{
    setTargetPoint(point?:TPoint):void;
    isTargetReached(): boolean;

    getActor():IActor|undefined;
   
    setTargetAngle(angle: number):void;

    getActorController():ActorController<TGameActions,TActor>;
}