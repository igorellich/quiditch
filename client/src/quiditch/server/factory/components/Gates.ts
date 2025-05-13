import { BodyActorDecorator } from "../../../../engine/server/base/Actor/BodyActorDecorator";
import { IBodiedActor } from "../../../../engine/server/base/Actor/IBodiedActor";
import { Collision } from "@common/Collision";
import { IPhysicsManager } from "../../../../engine/server/base/IPhysicsManager";
import { ActorNames } from "../../../common/constants";


export class Gates extends BodyActorDecorator{
    private _prevTime:number=0;
   
    private _onGoal?:()=>void;

    constructor(mfActor: IBodiedActor, physicsManager: IPhysicsManager, onGoal?:()=>void){
        super(mfActor, physicsManager);
        this._onGoal = onGoal;
    }
    async onCollision(collision: Collision, elapsedTime: number): Promise<void> {
       
       await super.onCollision(collision, elapsedTime);
       // console.log("Gates collision", elapsedTime, collision)
       const ball = collision.actorB&&collision.actorB.getName()==ActorNames.quaffle?collision.actorB:collision.actorA&&collision.actorA.getName()==ActorNames.quaffle?collision.actorA:null;
       if(ball && elapsedTime-this._prevTime>5000){
        const ballSensor = ball===collision.actorA?collision.sensorA:collision.sensorB;
        if(!ballSensor){
            this._prevTime = elapsedTime;
           
            if(this._onGoal){
                console.log("gates on goal", this, elapsedTime, this._prevTime)
                this._onGoal();
            }
        }
       }
      
    }
    public setOnGoal(onGoal:()=>void){
        this._onGoal = onGoal;
    }
}