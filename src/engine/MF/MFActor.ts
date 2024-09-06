import { Actor } from "../base/Actor";
import { Vector2d } from "../base/Vector2d";
import { IBody } from "./IBody";
import { IMesh } from "./IMesh";

export class MFActor extends Actor{
    
    
    private readonly _body:IBody;
    private readonly _mesh:IMesh;
    public constructor(body:IBody, mesh:IMesh){
        super();
        this._mesh = mesh;
        this._body = body;
    }
    public async update(): Promise<void> {
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