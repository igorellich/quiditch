import { IActor } from "../../base/IActor";
import { Vector2d } from "../../base/Vector2d";
import { IMesh } from "../IMesh";

export class MeshBasedActor implements IActor{
    private readonly _mesh:IMesh
    constructor(mesh:IMesh){
        this._mesh = mesh;
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
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
       
    }
    
}