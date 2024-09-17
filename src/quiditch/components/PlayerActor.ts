import { IBodiedActor } from "../../engine/base/Actor/IBodiedActor";
import { BodyActorDecorator } from "../../engine/base/Actor/BodyActorDecorator";


export class PlayerActor extends BodyActorDecorator {

    private _jointBody:IBodiedActor;
    public override async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        await super.tick(elapsedTime, deltaTime);

        

        const castResult = await this.castRay(0,5);
        if (castResult.hit && !this._jointBody && castResult.instance.getName()==="ball") {
            
            if (castResult.distance < 5) {
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
                this._jointBody = null;
            },200)
            
        }
    }
}