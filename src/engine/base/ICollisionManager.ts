import { Actor } from "./Actor";
import { Collision } from "./Collision";
import { ITickable } from "./ITickable";

export interface ICollisionManager{
    getCollisions(actors:ITickable[]):Collision[];
    step(delta: number):void;
}