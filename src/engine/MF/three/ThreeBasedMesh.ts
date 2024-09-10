import { Mesh } from "three";
import { IMesh } from "../IMesh";
import { Vector2d } from "../../base/Vector2d";

export class ThreeBasedMesh implements IMesh{

    private readonly _mesh:Mesh;
    
    constructor(mesh:Mesh){
        this._mesh = mesh;
    }

    async setPosition(x: number, y: number): Promise<void> {
        this._mesh.position.set(x, y, this._mesh.position.z);
    }
    async getPosition(): Promise<Vector2d> {
        return this._mesh.position;
    }
    async setRotation(rotation: number): Promise<void> {
       this._mesh.rotation.z  = rotation;
    }
    async getRotation(): Promise<number> {
        return this._mesh.rotation.z;
    }

}