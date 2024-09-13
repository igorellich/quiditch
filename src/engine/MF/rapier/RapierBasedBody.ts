import { RigidBody } from "@dimforge/rapier2d";
import { IBody } from "../IBody";
import { Vector2d } from "../../base/Vector2d";
import { interactionGroups } from "../../../utils/interaction-groups";

// Facade-class for rapier's RigidBody
export class RapierBasedBody implements IBody{
    private _speed: number;

    public getSpeed():number{
        return this._speed;
    }

    public getRotationSpeed():number{
        return this._rotationSpeed;
    }

    private _rotationSpeed: number;
    private readonly _rigidBody: RigidBody;
    constructor(rigidBody: RigidBody) {
        this._rigidBody = rigidBody;
    }
    setSpeed(speed: number): void {
        this._speed = speed;
    }
    setRotationSpeed(rotationSpeed: number): void {
        this._rotationSpeed = rotationSpeed;
    }
    async move(backward: boolean, delta:number): Promise<void> {
        const speed = backward?-this._speed:this._speed;
        const directionVector = new Vector2d(
            -Math.sin(await this.getRotation()) * speed * this._rigidBody.mass()*2000*delta,
            Math.cos(await this.getRotation()) * speed* this._rigidBody.mass()*2000*delta
        )
        this._rigidBody.setLinearDamping(10)
       
        this._rigidBody.applyImpulse(directionVector,true);
    }
    async rotate(right: boolean, delta:number): Promise<void> {
        const rotatingSpeed = right?-this._rotationSpeed:this._rotationSpeed*delta;
        const newRotation = await this.getRotation() + rotatingSpeed/2;
        await this.setRotation(newRotation);
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
        return new Vector2d(this._rigidBody.translation().x,this._rigidBody.translation().y);
        
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