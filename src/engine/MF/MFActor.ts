import { Actor } from "../base/Actor";
import { IBodiedActor } from "../base/IBodiedActor";
import { Vector2d } from "../base/Vector2d";
import { IBody } from "./IBody";
import { IMesh } from "./IMesh";

export class MFActor extends Actor implements IBodiedActor{
    public async setCollisions<TCollision>(memberGroups: TCollision[], filterGroups: TCollision[]): Promise<void> {
        this._body.setCollisions(memberGroups, filterGroups)
    }
    
    
    private readonly _body:IBody;
    private readonly _mesh:IMesh;
    public constructor(body:IBody, mesh:IMesh, speed:number, rotationSpeed:number){
        super(speed, rotationSpeed);
        this._mesh = mesh;
        this._body = body;
    }
    public async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        this._body.tick(elapsedTime, deltaTime);
        const position = await this._body.getPosition();
        this._mesh.setPosition(position.x, position.y);

        const rotation = await this._body.getRotation();
        this._mesh.setRotation(rotation);
        
    }

    public async setPosition(x: number, y: number): Promise<void> {
       this._body.setPosition(x,y);
      
    }

    public getPosition(): Promise<Vector2d> {
        return this._body.getPosition();
    }

    public async setRotation(rotation: number): Promise<void> {
        this._body.setRotation(rotation);           
    }

    public getRotation(): Promise<number> {
        return this._body.getRotation();
    }
    public getBody():IBody{
        return this._body;
    }
}