import { IActor } from "../../base/Actor/IActor";
import { IMovable } from "../../base/Actor/Imoveable";
import { Vector2d } from "../../base/Vector2d";
import { IMesh } from "../IMesh";

export class MeshBasedActor implements IActor{
    private readonly _mesh:IMesh
    constructor(mesh:IMesh){
        this._mesh = mesh;
    }
    unjoin(target: IMovable): void {
       //TODO
    }
    join(target: IMovable): void {
        //TODO
    }
    setSpeed(speed: number): void {
        //TODO
    }
    setRotationSpeed(rotationSpeed: number): void {
        //TODO
    }
    move(backward?: boolean): void {
        //TODO
    }
    rotate(right?: boolean): void {
        //TODO
    }
    async getDirectionVector(): Promise<Vector2d> {
        let result: Vector2d = undefined

        result = new Vector2d(-Math.sin(await this.getRotation()),Math.cos(await this.getRotation()));       

        return result;
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
    
}