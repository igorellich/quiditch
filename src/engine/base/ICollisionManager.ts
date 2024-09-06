import { Actor } from "./Actor";
import { Collision } from "./Collision";

export interface ICollisionManager{
    getCollisions(actors:Actor[]):Collision[];
    step(delta: number):void;
}