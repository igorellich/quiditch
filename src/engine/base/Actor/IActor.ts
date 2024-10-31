import { Collision } from "../Collision";
import { IMovable } from "../Imoveable";
import { ITickable } from "../ITickable";
import { Vector2d } from "../Vector2d";
import { ActorState } from "./Actor";

export interface IActor extends ITickable, IMovable{
  

     getDirectionVector():Promise<Vector2d>;
     getName():string;
     getAngelToTarget(target: Vector2d):Promise<number>;

     onCollision(collision:Collision, elapsedTime: number):Promise<void>;

     getJoints():Promise<IMovable[]>;

     getState():Promise<ActorState>;
     setState(state:ActorState):Promise<void>;

     getId():string;
    
}