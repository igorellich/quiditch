import { BodyActorDecorator } from "../../../../engine/server/base/Actor/BodyActorDecorator";
import { IBodiedActor } from "../../../../engine/server/base/Actor/IBodiedActor";
import { Collision } from "@common/Collision";
import { IPhysicsManager } from "../../../../engine/server/base/IPhysicsManager";
import {PlayerState} from "../../../common/PlayerState"
import { Quaffle } from "./balls/Quaffle";


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

    private async _hasQuaffle(): Promise<boolean> {
        let hasQuaffle = false;
        const joints = await this.getJoints();

        for (const j of joints) {
            if (j instanceof Quaffle) {
                hasQuaffle = true;
                break;
            }
        }
        return hasQuaffle;
    }

    async getState(): Promise<PlayerState> {
        const actorState = await super.getState() as unknown as PlayerState;
        actorState.color = this._color;
        actorState.hasQuaffle = await this._hasQuaffle();
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


