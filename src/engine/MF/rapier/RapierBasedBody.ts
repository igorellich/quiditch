import { RigidBody } from "@dimforge/rapier2d";
import { IBody } from "../IBody";
import { Vector2d } from "../../base/Vector2d";
import { interactionGroups } from "../../../utils/interaction-groups";

// Facade-class for rapier's RigidBody
export class RapierBasedBody implements IBody{
    private readonly _rigidBody: RigidBody;
    constructor(rigidBody: RigidBody) {
        this._rigidBody = rigidBody;
    }
    async setCollisions<TCollision>(memberGroups: TCollision[], filterGroups: TCollision[]): Promise<void> {

        if (this._rigidBody.numColliders() > 0) {
            const rapierCollisionGroups = interactionGroups(memberGroups as number | number[], filterGroups as number | number[]);
            for (let i = 0; i < this._rigidBody.numColliders(); i++) {
                const collider = this._rigidBody.collider(i);
                collider.setCollisionGroups(rapierCollisionGroups);
            }
        }
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        
    }
   
    async setPosition(x: number, y: number): Promise<void> {
        if (this._rigidBody.isKinematic()) {
            this._rigidBody.setNextKinematicTranslation({ x, y });
        } else {
            this._rigidBody.setTranslation({ x, y }, true);
        }

    }
    async getPosition(): Promise<Vector2d> {
        return this._rigidBody.translation();
        
    }
    async setRotation(rotation: number): Promise<void> {
        // not so cool
        //if (this._rigidBody.isKinematic()) {
            //this._rigidBody.setNextKinematicRotation(rotation);
        //} else {
            this._rigidBody.setRotation(rotation, true);
        //}
        
    }
    async getRotation(): Promise<number> {
       return this._rigidBody.rotation();
    }
    getRigidBody():RigidBody{
        return this._rigidBody;
    }
    
}