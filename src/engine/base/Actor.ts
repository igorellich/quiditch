import { IObject2D } from "./IObject2D";
import { Vector2d } from "./Vector2d";

export abstract class Actor implements IObject2D{
   
    public abstract  setPosition(x: number, y: number): Promise<void>;
    public abstract  getPosition(): Promise<Vector2d>;
    public abstract  setRotation(rotation: number): Promise<void>;
    public abstract  getRotation(): Promise<number>;    
   
    public abstract  update(elapsedTime:number, deltaTime: number):Promise<void>;
}