import { BodyActorDecorator } from "../../../../engine/MB/Actor/BodyActorDecorator";
import { IBodiedActor } from "../../../../engine/MB/Actor/IBodiedActor";
import { Collision } from "../../../../engine/base/Collision";
import { SceneManager } from "../../../../engine/base/SceneManager";
import { ActorNames } from "../../../constants";

export class Gates extends BodyActorDecorator{
    private _prevTime:number=0;
   
    private _onGoal?:()=>void;

    constructor(mfActor: IBodiedActor, sceneManager: SceneManager, onGoal?:()=>void){
        super(mfActor, sceneManager);
        this._onGoal = onGoal;
    }
    async onCollision(collision: Collision, elapsedTime: number): Promise<void> {
       
       await super.onCollision(collision, elapsedTime);
       // console.log("Gates collision", elapsedTime, collision)
       const ball = collision.actorB&&collision.actorB.getName()==ActorNames.quaffle?collision.actorB:collision.actorA&&collision.actorA.getName()==ActorNames.quaffle?collision.actorA:null;
       if(ball && elapsedTime-this._prevTime>1){
        const ballSensor = ball===collision.actorA?collision.sensorA:collision.sensorB;
        if(!ballSensor){
            this._prevTime = elapsedTime;
           
            if(this._onGoal){
                this._onGoal();
            }
        }
       }
      
    }
    public setOnGoal(onGoal:()=>void){
        this._onGoal = onGoal;
    }
}