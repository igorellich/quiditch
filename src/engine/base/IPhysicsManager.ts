import { Actor } from "./Actor/Actor";
import { Collision } from "./Collision";
import { IBodiedActor } from "./Actor/IBodiedActor";
import { ITickable } from "./ITickable";
import { Vector2d } from "./Vector2d";

export interface IPhysicsManager{
    getCollisions(actors:ITickable[]):Collision[];
    step(delta: number):void;
    castRay(origin: Vector2d, dir:Vector2d, rayLength: number, sourceActor?: IBodiedActor,targetActors?:IBodiedActor[]): Promise<RayCastResult>;
}
export type RayCastResult={
    hit:boolean, instance?: IBodiedActor, distance?:number
}