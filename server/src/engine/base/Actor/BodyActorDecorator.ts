import { ActorDecorator } from "../../base/Actor/ActorDecorator";
import { IBodiedActor } from "./IBodiedActor";
import { Vector2d } from "@common/engine/Vector2d";
import { IBody } from "../IBody";
import { IPhysicsManager } from "../../base/IPhysicsManager";

export class BodyActorDecorator extends ActorDecorator implements IBodiedActor {

    private readonly _physicsManager: IPhysicsManager;
    private readonly _id:number=Math.random();

        constructor(mfActor: IBodiedActor, physicsManager: IPhysicsManager) {
            super(mfActor);
            this._physicsManager = physicsManager;
        
        }
    
  
    getBody(): IBody {
        return (this._baseActor as IBodiedActor).getBody();
    }
    protected async castRay(angleDelta: number, rayLength: number) {
        const dir: Vector2d = new Vector2d(
            -Math.sin(await this.getRotation() + angleDelta),
            Math.cos(await this.getRotation() + angleDelta)).normalize();

        return this._physicsManager.castRay(await this.getPosition(), dir, rayLength, this)
    }
 
}