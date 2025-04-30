import { Collision } from "@common/Collision";
import { ITickable } from "@common/ITickable";
import { Vector2d } from "@common/Vector2d";
import { IActor } from "@common/IActor";

export interface IPhysicsManager extends ITickable{
    getCollisions(actors:ITickable[]):Collision[];
    castRay(origin: Vector2d, dir:Vector2d, rayLength: number, sourceActor?: IActor,targetActors?:IActor[]): Promise<RayCastResult>;   
}
export type RayCastResult={
    hit:boolean, instance?: IActor, distance?:number
}