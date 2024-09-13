import { ImpulseJoint, JointData, RevoluteImpulseJoint, RigidBody, World } from "@dimforge/rapier2d";
import { IBody } from "../IBody";
import { Vector2d } from "../../base/Vector2d";
import { interactionGroups } from "../../../utils/interaction-groups";
import { IMovable } from "../../base/Actor/Imoveable";
import { IBodiedActor } from "../../base/Actor/IBodiedActor";

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

    private readonly _world:World;

    private _jointsMap:Map<IMovable,ImpulseJoint> = new Map<IMovable,ImpulseJoint>();
    constructor(rigidBody: RigidBody,world:World) {
        this._rigidBody = rigidBody;
        this._world = world;
    }
    unjoin(target: IMovable): void {
        if(this._jointsMap.get(target)){
            this._world.removeImpulseJoint(this._jointsMap.get(target), true);
            this._jointsMap.delete(target);
        }
       
    }
    join(target: IMovable): void {

        let params = JointData.revolute({ x: 7, y: 7 }, { x:0, y: 0  });
        if(!this._jointsMap.get(target)){
        this._jointsMap.set(target, this._world.createImpulseJoint(params, ((target as IBodiedActor).getBody() as RapierBasedBody)._rigidBody, this._rigidBody, true));
        //(this._jointsMap.get(target) as RevoluteImpulseJoint).configureMotorVelocity(5.0, 0.0);
        }
        
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