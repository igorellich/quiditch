import { Vector2d } from "../../engine/base/Vector2d";
import { Patroller } from "../../engine/ai/palyers/Patroller";
import { Quaffle } from "../factory/MB/components/balls/Quaffle";
import { PlayerActor } from "../factory/MB/components/PlayerActor";
import { IZone } from "../../engine/ai/zone/IZone";
import { ITargetPointer } from "../controls/ITargetPointer";
import { SceneManager } from "../../engine/base/SceneManager";
import { ActorNames } from "../constants";
import { IActor } from "../../engine/base/Actor/IActor";
import { normaliseAngle } from "../../utils/geometryUtils";

export class Chaser extends Patroller<Vector2d> {
    private readonly _sceneManager: SceneManager;
    constructor(zone: IZone<Vector2d>, targetPointer: ITargetPointer<Vector2d>, reachInterval: number, sceneManager: SceneManager) {
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

                    await this._targetPointer.setTargetPoint(undefined);
                    const gates = await this._sceneManager.getClosestActor(actorPos, ActorNames.gates, this._zone);
                    if (gates) {
                        if (await this._toAttackPos(actor, gates)) {
                            const gatesPos = await gates.getPosition();
                            const angle = await actor.getAngelToTarget(gatesPos);

                            if (Math.abs(angle) > Math.PI / 1800) {
                                this._targetPointer.setTargetAngle(angle);
                            } else {
                                console.log((await gates.getRotation()) * 180 / 3.14, (await actor.getRotation()) * 180 / 3.14); //0-50
                                actor.attack();
                            }
                        }
                    }
                    break;
                }
            }
            if (!hasQuaffle) {
                const closestQuaffle = await this._sceneManager.getClosestActor(actorPos, ActorNames.quaffle, this._zone);
                if (closestQuaffle) {
                    this._chaseQuaffle(actor, closestQuaffle);

                } else {
                    this.setPatrolling(true);
                }
            }

        }
        await super.tick(elapsedTime, deltaTime);
    }

    private async _toAttackPos(actor: IActor, gates: IActor): Promise<boolean> {
        let result = false;
        const gatesRotation = await gates.getRotation();
        const actorRotation = await actor.getRotation();
        const gatesPos = await gates.getPosition();
        const actorPos = await actor.getPosition();
        const distance = actorPos.distanceTo(gatesPos);
        const angle = await actor.getAngelToTarget(gatesPos);
        const attackAngle= normaliseAngle(Math.PI - (gatesRotation - (actorRotation+angle)));

        if ((distance-0.1 < 15 && distance+0.1 > 10) && Math.abs(attackAngle )< Math.PI / 4) {
            result = true;
        } else {
            const attackLine = await this._getGatesAttackLine(gates);
            const dist0 = actorPos.distanceTo(attackLine[0]);
            const dist1 = actorPos.distanceTo(attackLine[1]);
            const attackPoint = dist0 > dist1 ? attackLine[1] : attackLine[0];
            await this._targetPointer.setTargetPoint(attackPoint);
        }
        return result;
    }
   private async _getGatesAttackLine(gates:IActor):Promise<Vector2d[]>{
        const gatesDir = await gates.getDirectionVector();
        const gatesPos = await gates.getPosition();
        const closePoint = new Vector2d(gatesPos.x+gatesDir.x*10, gatesPos.y+gatesDir.y*10);
        const farPoint = new Vector2d(gatesPos.x+gatesDir.x*15, gatesPos.y+gatesDir.y*15);
        return [closePoint,farPoint];
    }
    private async _chaseQuaffle(actor: IActor, quaffle:IActor){
        const joints = await quaffle.getJoints();
        const quafflePos = await quaffle.getPosition();
        if (joints.length > 0) {
            setTimeout(async () => {
                const dirVec = await actor.getDirectionVector();
                await this._targetPointer.setTargetPoint(new Vector2d(quafflePos.x - dirVec.x * 5, quafflePos.y - dirVec.y * 5));

            }, 200)

        } else {
            await this._targetPointer.setTargetPoint(quafflePos);
        }
    }
}