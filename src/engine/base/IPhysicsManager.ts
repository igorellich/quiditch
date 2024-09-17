import { Collision } from "./Collision";
import { ITickable } from "./ITickable";
import { Vector2d } from "./Vector2d";
import { IActor } from "./Actor/IActor";

export interface IPhysicsManager{
    getCollisions(actors:ITickable[]):Collision[];
    step(delta: number):void;
    castRay(origin: Vector2d, dir:Vector2d, rayLength: number, sourceActor?: IActor,targetActors?:IActor[]): Promise<RayCastResult>;
}
export type RayCastResult={
    hit:boolean, instance?: IActor, distance?:number
}