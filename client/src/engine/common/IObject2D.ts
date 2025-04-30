import { Vector2d } from "./Vector2d";

export interface IObject2D{
    setPosition(x: number, y:number):Promise<void>;
    getPosition():Promise<Vector2d>;
    setRotation(rotation: number):Promise<void>;
    getRotation():Promise<number>;
   
}