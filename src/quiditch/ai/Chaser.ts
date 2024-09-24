import { Vector2d } from "../../engine/base/Vector2d";
import { Patroller } from "../../engine/ai/palyers/Patroller";
import { Quaffle } from "../factory/MB/components/balls/Quaffle";
import { PlayerActor } from "../factory/MB/components/PlayerActor";
import { IZone } from "../../engine/ai/zone/IZone";
import { ITargetPointer } from "../controls/ITargetPointer";
import { SceneManager } from "../../engine/base/SceneManager";

export class Chaser extends Patroller<Vector2d> {
    private readonly _sceneManager: SceneManager;
    constructor(zone: IZone<Vector2d>, targetPointer:ITargetPointer<Vector2d>, reachInterval: number, sceneManager:SceneManager){
        super(zone, targetPointer, reachInterval);
        this._sceneManager = sceneManager;

    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        const actor = this.getActor();
        
        if (actor) {

            const joints = await actor.getJoints();
            for (const j of joints) {
                if (j instanceof Quaffle) {
                    if (actor instanceof PlayerActor) {
                        actor.attack();

                        break;
                    }
                }
            }

            const closestQuaffle = await this._getClosestQuaffle();
            if (closestQuaffle) {
                console.log("found quaffle", closestQuaffle)
                this._targetPointer.setTargetPoint(await closestQuaffle.getPosition());
            } else {
                this.setPatrolling(true);
            }

        }
        await super.tick(elapsedTime, deltaTime);
    }
    private async _getClosestQuaffle(): Promise<Quaffle | undefined> {
        const actors = this._sceneManager.getActors();
        let distance: number | undefined;
        let result: Quaffle | undefined;
        for (let actor of actors) {
            if (actor instanceof Quaffle) {
                if (await this._zone.belongs(await actor.getPosition())) {
                    const currDist = (await this._targetPointer.getActor().getPosition()).distanceTo(await actor.getPosition());
                    if (!distance || currDist < distance) {
                        distance = currDist;
                        result = actor;
                    }
                }

            }
        }
        return result;
    }
}