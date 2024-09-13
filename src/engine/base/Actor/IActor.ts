import { IObject2D } from "../IObject2D";
import { ITickable } from "../ITickable";
import { Vector2d } from "../Vector2d";

export interface IActor extends IObject2D, ITickable{
     getSpeed():number

     getRotationSpeed():number

     getDirectionVector():Promise<Vector2d>;
}