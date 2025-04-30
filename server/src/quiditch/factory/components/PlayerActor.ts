import { BodyActorDecorator } from "../../../../engine/server/base/Actor/BodyActorDecorator";
import { IBodiedActor } from "../../../../engine/server/base/Actor/IBodiedActor";
import { Collision } from "@common/engine/Collision";
import { IPhysicsManager } from "../../../../engine/server/base/IPhysicsManager";
import {PlayerState} from "../../../common/PlayerState"

export class PlayerActor extends BodyActorDecorator {

    private readonly _color:string|undefined;
    constructor(mfActor: IBodiedActor, physicsManager: IPhysicsManager, color:string|undefined) {
        super(mfActor,physicsManager);
        this._color = color;
       
    }
    public override async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        await super.tick(elapsedTime, deltaTime);

        
        
        //const castResult = await this.castRay(0,5);
        // if (castResult && castResult.hit && !this._jointActor && castResult.instance && castResult.instance.getName()==="ball") {
            
        //     if (castResult.distance && castResult.distance < 5) {
        //         await this.join(castResult.instance);
        //         this._jointActor = castResult.instance;
        //     }

        // }
    }
    async onCollision(collision: Collision, elapsedTime: number): Promise<void> {
        await super.onCollision(collision, elapsedTime);
        const joints = await this.getJoints();
        if(joints.length>0){
            for(const j of joints){
                this.unjoin(j);
                await j.move(false, 1/600);
            } 
        }
    }
    public async attack():Promise<void>{
        const joints = await this.getJoints();
        for(const j of joints){
            this.unjoin(j);
            await j.move(false, 1/60);
        }       
    }
    async getState(): Promise<PlayerState> {
        const actorState: PlayerState = await super.getState() as PlayerState;
        actorState.color = this._color;
        return actorState;
    }
    private _isControled: boolean = false;
    private _playerId?: string;
    public setIsControlled(control: boolean, playerId?:string){
        this._isControled = control;
        this._playerId = playerId;
    }
    public getPlayerId():string|undefined{
        return this._playerId;
    }
    public getIsControlled():boolean{
        return this._isControled;
    }
}


