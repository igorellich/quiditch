import { RigidBody } from "@dimforge/rapier2d";
import { IBody } from "../../../engine/MF/IBody";
import { Vector2d } from "../../../engine/base/Vector2d";

// Facade-class for rapier's RigidBody
export class RapierBasedBody implements IBody{
    private readonly _rigidBody: RigidBody;
    constructor(rigidBody: RigidBody) {
        this._rigidBody = rigidBody;
    }
   
    async setPosition(x: number, y: number): Promise<void> {
        this._rigidBody.setTranslation({x,y},true);
    }
    async getPosition(): Promise<Vector2d> {
        return this._rigidBody.translation();
    }
    async setRotation(rotation: number): Promise<void> {
        this._rigidBody.setRotation(rotation, true);
    }
    async getRotation(): Promise<number> {
       return this._rigidBody.rotation();
    }
    getRigidBody():RigidBody{
        return this._rigidBody;
    }
}