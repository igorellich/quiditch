import { Collision } from "../Collision";
import { IMovable } from "../Imoveable";
import { IObject2D } from "../IObject2D";
import { ITickable } from "../ITickable";
import { Vector2d } from "../Vector2d";

export interface IActor extends ITickable, IMovable{
  

     getDirectionVector():Promise<Vector2d>;
     getName():string;
     getAngelToTarget(target: Vector2d):Promise<number>;

     onCollision(collision:Collision, elapsedTime: number):Promise<void>;


    
}