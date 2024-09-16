import { IObject2D } from "../IObject2D";
import { ITickable } from "../ITickable";
import { Vector2d } from "../Vector2d";
import { IMovable } from "../Imoveable";

export interface IActor extends IObject2D, ITickable, IMovable{
  

     getDirectionVector():Promise<Vector2d>;

    
}