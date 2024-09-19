import { Actor } from "../../base/Actor/Actor";
import { IMovable } from "../../base/Imoveable";
import { Vector2d } from "../../base/Vector2d";
import { IMesh } from "../IMesh";

export class MeshBasedActor extends Actor{
 
    private readonly _mesh:IMesh
   
    constructor(name: string, mesh:IMesh){
        super(name);
        this._mesh = mesh;
        
    }
    
    async unjoin(target: IMovable): Promise<void> {
       //TODO
    }
    async join(target: IMovable): Promise<void> {
        //TODO
    }
    setSpeed(speed: number): void {
        //TODO
    }
    setRotationSpeed(rotationSpeed: number): void {
        //TODO
    }
    async move(backward?: boolean): Promise<void> {
        //TODO
        return;
    }
    async rotate(right?: boolean): Promise<void> {
        //TODO
        return;
    }
    async getDirectionVector(): Promise<Vector2d> {
        return new Vector2d(-Math.sin(await this.getRotation()),Math.cos(await this.getRotation()));       
    }
    getSpeed(): number {
        return 0;
    }
    getRotationSpeed(): number {
        return 0;
    }
    async setPosition(x: number, y: number): Promise<void> {
       this._mesh.setPosition(x,y);
    }
    getPosition(): Promise<Vector2d> {
       return this._mesh.getPosition();
    }
    async setRotation(rotation: number): Promise<void> {
        this._mesh.setRotation(rotation);
    }
    getRotation(): Promise<number> {
        return this._mesh.getRotation();
    }
    getMesh(){
        return this._mesh;
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
       
    }
    
       public async setCollisions<TCollision>(memberGroups: TCollision[], filterGroup: TCollision[]): Promise<void> {
        
    }
}