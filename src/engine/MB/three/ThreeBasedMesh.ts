import { Object3D } from "three";
import { IMesh } from "../IMesh";
import { Vector2d } from "../../base/Vector2d";

export class ThreeBasedMesh implements IMesh{

    protected readonly _mesh:Object3D;
    
    constructor(mesh:Object3D){
        this._mesh = mesh;
    }
    public getMesh(){
        return this._mesh;
    }

    async setPosition(x: number, y: number): Promise<void> {
        this._mesh.position.set(x, y, this._mesh.position.z);
    }
    async getPosition(): Promise<Vector2d> {
        return new Vector2d(this._mesh.position.x,this._mesh.position.y);
    }
    async setRotation(rotation: number): Promise<void> {
       this._mesh.rotation.z  = rotation;
    }
    async getRotation(): Promise<number> {
        return this._mesh.rotation.z;
    }

}