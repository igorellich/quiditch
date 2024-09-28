import { ActorDecorator } from "../../base/Actor/ActorDecorator";
import { IBodiedActor } from "./IBodiedActor";
import { SceneManager } from "../../base/SceneManager";
import { Vector2d } from "../../base/Vector2d";
import { IBody } from "../IBody";

export class BodyActorDecorator extends ActorDecorator implements IBodiedActor {

    private readonly _sceneManager: SceneManager;
    private readonly _id:number=Math.random();

    constructor(mfActor: IBodiedActor, sceneManager: SceneManager) {
        super(mfActor);
        this._sceneManager = sceneManager;
       
    }
    
  
    getBody(): IBody {
        return (this._baseActor as IBodiedActor).getBody();
    }
    protected async castRay(angleDelta: number, rayLength: number) {
        const dir: Vector2d = new Vector2d(
            -Math.sin(await this.getRotation() + angleDelta),
            Math.cos(await this.getRotation() + angleDelta)).normalize();

        return this._sceneManager.castRay(await this.getPosition(), dir, rayLength, this)
    }
 
}