import { BodyActorDecorator } from "../../../../engine/MB/Actor/BodyActorDecorator";
import { IBodiedActor } from "../../../../engine/MB/Actor/IBodiedActor";
import { ActorState } from "../../../../engine/base/Actor/Actor";
import { Collision } from "../../../../engine/base/Collision";
import { SceneManager } from "../../../../engine/base/SceneManager";

export class PlayerActor extends BodyActorDecorator {

    private readonly _color:string|undefined;
    constructor(mfActor: IBodiedActor, sceneManager: SceneManager, color:string|undefined) {
        super(mfActor,sceneManager);
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
}
export type PlayerState ={
    position: {x:number, y:number};
    rotation: number;
    name: string;
    id: string;
    color:string|undefined;
}