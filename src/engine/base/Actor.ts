import { IObject2D } from "./IObject2D";
import { ITickable } from "./ITickable";
import { Vector2d } from "./Vector2d";

export abstract class Actor implements IObject2D, ITickable{
   
    private readonly _speed: number;

    public getSpeed():number{
        return this._speed;
    }

    public getRotationSpeed():number{
        return this._rotationSpeed;
    }

    private readonly _rotationSpeed: number;

    constructor(speed:number = 0, rotationSpeed: number = 0){
        this._speed = speed;
        this._rotationSpeed = rotationSpeed;
    }
    public abstract  setPosition(x: number, y: number): Promise<void>;
    public abstract  getPosition(): Promise<Vector2d>;
    public abstract  setRotation(rotation: number): Promise<void>;
    public abstract  getRotation(): Promise<number>;    
   
    public abstract  tick(elapsedTime:number, deltaTime: number):Promise<void>;

    public abstract setCollisions<TCollision>(memberGroups:TCollision[], filterGroup:TCollision[]):Promise<void>;
      
}