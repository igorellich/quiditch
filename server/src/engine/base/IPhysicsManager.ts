import { Collision } from "@common/engine/Collision";
import { ITickable } from "@common/engine/ITickable";
import { Vector2d } from "@common/engine/Vector2d";
import { IActor } from "@common/engine/IActor";

export interface IPhysicsManager extends ITickable{
    getCollisions(actors:ITickable[]):Collision[];
    castRay(origin: Vector2d, dir:Vector2d, rayLength: number, sourceActor?: IActor,targetActors?:IActor[]): Promise<RayCastResult>;
    setPause(pause:boolean):void;
}
export type RayCastResult={
    hit:boolean, instance?: IActor, distance?:number
}