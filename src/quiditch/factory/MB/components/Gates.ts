import { BodyActorDecorator } from "../../../../engine/MB/Actor/BodyActorDecorator";
import { Collision } from "../../../../engine/base/Collision";

export class Gates extends BodyActorDecorator{
    private _prevTime:number=0;
    private _goalsCount:number = 0;
    async onCollision(collision: Collision, elapsedTime: number): Promise<void> {
       
       await super.onCollision(collision, elapsedTime);
       console.log("Gates collision", elapsedTime, collision)
       const ball = collision.actorB&&collision.actorB.getName()=="ball"?collision.actorB:collision.actorA&&collision.actorA.getName()=="ball"?collision.actorA:null;
       if(ball && elapsedTime-this._prevTime>1){
        const ballSensor = ball===collision.actorA?collision.sensorA:collision.sensorB;
        if(!ballSensor){
            this._prevTime = elapsedTime;
            this._goalsCount++;
            const goalsEl =document.querySelector(".goals");
            if(goalsEl){
                goalsEl.innerHTML = this._goalsCount.toString();
            }
        }
       }
      
    }
}