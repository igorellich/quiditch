import { Vector2d } from "../../engine/base/Vector2d";
import { Patroller } from "../../engine/ai/palyers/Patroller";
import { Quaffle } from "../factory/MB/components/balls/Quaffle";
import { PlayerActor } from "../factory/MB/components/PlayerActor";
import { IZone } from "../../engine/ai/zone/IZone";
import { ITargetPointer } from "../controls/ITargetPointer";
import { SceneManager } from "../../engine/base/SceneManager";
import { ActorNames } from "../constants";

export class Chaser extends Patroller<Vector2d> {
    private readonly _sceneManager: SceneManager;
    constructor(zone: IZone<Vector2d>, targetPointer:ITargetPointer<Vector2d>, reachInterval: number, sceneManager:SceneManager){
        super(zone, targetPointer, reachInterval);
        this._sceneManager = sceneManager;

    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        this.setPatrolling(false);
        const actor = this.getActor();
        
        if (actor && actor instanceof PlayerActor) {
            const actorPos = await actor.getPosition();
            const joints = await actor.getJoints();
            let hasQuaffle = false;
            for (const j of joints) {
                if (j instanceof Quaffle) {
                    hasQuaffle = true;

                    this._targetPointer.setTargetPoint(undefined);
                    const gates = await this._sceneManager.getClosestActor(actorPos, ActorNames.gates, this._zone);
                    if (gates) {
                        const gatesPos = await gates.getPosition();
                        const angle = await actor.getAngelToTarget(gatesPos);
                        
                        if (Math.abs(angle) > Math.PI/ 1800) {
                            this._targetPointer.setTargetAngle(angle);
                        } else {
                            actor.attack();
                        }
                    }


                    break;

                }
            }
            if(!hasQuaffle){
            const closestQuaffle = await this._sceneManager.getClosestActor(actorPos, ActorNames.quaffle,this._zone);
            if (closestQuaffle) {
                const joints = await closestQuaffle.getJoints();
                const quafflePos = await closestQuaffle.getPosition();
                if(joints.length>0){
                    setTimeout(async () => {
                        const dirVec = await actor.getDirectionVector();
                        this._targetPointer.setTargetPoint(new Vector2d(quafflePos.x - dirVec.x*5, quafflePos.y - dirVec.y*5));

                    }, 200)

                } else {
                    this._targetPointer.setTargetPoint(quafflePos);
                }
                //console.log("found quaffle", closestQuaffle)
                
            } else {
                this.setPatrolling(true);
            }
        }

        }
        await super.tick(elapsedTime, deltaTime);
    }
   
}