import { Actor } from "./Actor";
import { Collision } from "./Collision";
import { ITickable } from "./ITickable";
import { Vector2d } from "./Vector2d";

export interface IPhysicsManager{
    getCollisions(actors:ITickable[]):Collision[];
    step(delta: number):void;
    castRay(origin: Vector2d, dir:Vector2d, rayLength: number, sourceActor?: Actor,targetActors?:Actor[]): Promise<RayCastResult>;
}
export type RayCastResult={
    hit:boolean, instance?: Actor, distance?:number
}