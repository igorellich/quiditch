import { Actor } from "../base/Actor/Actor";
import { IBodiedActor } from "./Actor/IBodiedActor";
import { IMovable } from "../base/Imoveable";
import { Vector2d } from "../base/Vector2d";
import { IBody } from "./IBody";
import { IMesh } from "./IMesh";
import { Collision } from "../base/Collision";

export class MBActor extends Actor implements IBodiedActor{
    async onCollision(collision: Collision): Promise<void> {
        
    }
    unjoin(target: IMovable): Promise<void> {
        super.unjoin(target);
        return this._body.unjoin(target);
    }
    getSpeed(): number {
        return this._body.getSpeed();
    }
    getRotationSpeed(): number {
        return this._body.getRotationSpeed();
    }
    setSpeed(speed: number): void {
        if(this._body){
        this._body.setSpeed(speed);
        }
    }
    setRotationSpeed(rotationSpeed: number): void {
        if(this._body){
        this._body.setRotationSpeed(rotationSpeed);
        }
    }
    public async setCollisions<TCollision>(memberGroups: TCollision[], filterGroups: TCollision[]): Promise<void> {
        this._body.setCollisions(memberGroups, filterGroups)
    }
    
    
    private readonly _body:IBody;
    private readonly _mesh:IMesh;

    public constructor(body:IBody, mesh:IMesh, speed:number, rotationSpeed:number, name:string){       
       
        super(name, speed, rotationSpeed);
        this._mesh = mesh;
        this._body = body;
        this._body.setSpeed(speed);
        this._body.setRotationSpeed(rotationSpeed);
       
    }
    getName(): string {
        return this._name;
    }
    async join(target: IMovable): Promise<void> {
        //console.log("on join")
        super.join(target);
        this._body.join(target);
    }
    async move(backward: boolean, delta:number): Promise<void> {
        await this._body.move(backward,delta);
    }
    async rotate(right: boolean, delta:number): Promise<void> {
        this._body.rotate(right, delta);
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