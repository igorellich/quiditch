import { BodyActorDecorator } from "../../../../engine/MB/Actor/BodyActorDecorator";
import { IActor } from "../../../../engine/base/Actor/IActor";

export class Gates extends BodyActorDecorator{
    private _prevTime:number=0;
    private _goalsCount:number = 0;
    async onCollision(actor: IActor, elapsedTime: number): Promise<void> {
       
       await super.onCollision(actor, elapsedTime);
       console.log("Gates collision", elapsedTime, actor)
       if(actor.getName()=="ball" && elapsedTime-this._prevTime>1){
        this._prevTime = elapsedTime;
        this._goalsCount++;
        const goalsEl =document.querySelector(".goals");
        if(goalsEl){
            goalsEl.innerHTML = this._goalsCount.toString();
        }
       
    }
    }
}