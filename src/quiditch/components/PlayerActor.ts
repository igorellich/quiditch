import { IBodiedActor } from "../../engine/base/Actor/IBodiedActor";
import { BodyActorDecorator } from "../../engine/MF/BodyActorDecorator";


export class PlayerActor extends BodyActorDecorator {

    private _jointBody:IBodiedActor;
    public override async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        await super.tick(elapsedTime, deltaTime);

        

        const castResult = await this.castRay(0,5);
        if (castResult.hit && !this._jointBody && castResult.instance.getName()==="ball") {
            
            if (castResult.distance < 5) {
                this.join(castResult.instance);
                this._jointBody = castResult.instance;
            }

        }
    }

    public attack():void{
        if(this._jointBody){
            this.unjoin(this._jointBody);
            this._jointBody.move(false,1/60);
            this._jointBody = null;
        }
    }
}