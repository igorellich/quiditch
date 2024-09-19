import { BodyActorDecorator } from "../../../../engine/MB/Actor/BodyActorDecorator";
import { IActor } from "../../../../engine/base/Actor/IActor";


export class PlayerActor extends BodyActorDecorator {

    private _jointBody?:IActor;
    public override async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        await super.tick(elapsedTime, deltaTime);

        

        const castResult = await this.castRay(0,5);
        if (castResult && castResult.hit && !this._jointBody && castResult.instance && castResult.instance.getName()==="ball") {
            
            if (castResult.distance && castResult.distance < 5) {
                await this.join(castResult.instance);
                this._jointBody = castResult.instance;
            }

        }
    }

    public async attack():Promise<void>{
        if(this._jointBody){
            await this.unjoin(this._jointBody);
            await this._jointBody.move(false, 1/60);
            setTimeout(()=>{
                this._jointBody = undefined;
            },200)
            
        }
    }
}