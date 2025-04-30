import { Vector2d } from "@common/engine/Vector2d";

import { IZone } from "../../../engine/server/ai/zone/IZone";
import { ITargetPointer } from "../../../../client/src/quiditch/server/controls/ITargetPointerquiditch/controls/ITargetPointer";
import { IActor } from "@common/engine/IActor";
import { normaliseAngle } from "@common/engine/utils/geometryUtils";
import { QuiditchGameManager } from "../../../../client/src/quiditch/server/game/QuiditchGameManageruiditch/game/QuiditchGameManager";
import { ActorController } from "../../../engine/server/controls/ActorController";
import { GameInputActions } from "../../common/constants";
import { Patroller } from "src/engine/ai/players/Patroller";
import { PlayerActor } from "../../../../client/src/quiditch/server/factory/components/PlayerActorh/factory/components/PlayerActor";
import { Quaffle } from "../../../../client/src/quiditch/server/factory/components/balls/Quafflefactory/components/balls/Quaffle";

export class Chaser extends Patroller<Vector2d> {
    private readonly _gameManager: QuiditchGameManager;
    constructor(zone: IZone<Vector2d>, targetPointer: ITargetPointer<Vector2d, GameInputActions, IActor>, reachInterval: number, gameManager: QuiditchGameManager) {
        super(zone, targetPointer, reachInterval);
        this._gameManager = gameManager;

    }
    private _initilaPos:Vector2d|undefined = undefined;

    public setInitialPos(pos:Vector2d):void{
        this._initilaPos = pos;
    };

  
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
       
        if (!this._isControlled) {
            // this.setPatrolling(true);
            // await super.tick(elapsedTime, deltaTime);
            // return;
            const actor = this.getActor();

            if (actor && actor instanceof PlayerActor) {
               
                const joints = await actor.getJoints();
                let hasQuaffle = false;
                for (const j of joints) {
                    if (j instanceof Quaffle) {
                        hasQuaffle = true;  
                        break;
                    }
                }
                if (!hasQuaffle) {
                    const closestQuaffle = await this._gameManager.getQuaffle();
                    if (closestQuaffle) {
                        await this._chaseQuaffle(closestQuaffle);

                    } else {
                        // no quaffle
                        if (this._initilaPos) {
                            this._targetPointer.setTargetPoint(this._initilaPos);
                        }
                    }
                }else{
                    this.setPatrolling(false);
                    const enemyGates = await this._gameManager.getEnemyGates(actor);
                    const gates = await this._gameManager.getClosestTarget(actor, enemyGates, this._zone);
                    if (gates) {
                        if (await this._toAttackPos(actor, gates)) {
                            const gatesPos = await gates.getPosition();
                            const angle = await actor.getAngelToTarget(gatesPos);

                            if (Math.abs(angle) > Math.PI / 180*2) {
                                this._targetPointer.setTargetAngle(angle);
                                // console.log(angle)
                            } else {

                                actor.attack();
                            }
                        }
                    }
                }

            }
            await super.tick(elapsedTime, deltaTime);
        }
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

        if ((distance-0.1 < 30 && distance+0.1 > 20) && Math.abs(attackAngle )< Math.PI / 4) {
            result = true;
        } else {
            const attackLine = await this._getGatesAttackLine(gates);
           
            const attackPoint = new Vector2d(attackLine[0].x + Math.random() * (attackLine[1].x - attackLine[0].x),
                attackLine[0].y + Math.random() * (attackLine[1].y - attackLine[0].y)
            )
            await this._targetPointer.setTargetPoint(attackPoint);
        }
        return result;
    }
   private async _getGatesAttackLine(gates:IActor):Promise<Vector2d[]>{
        const gatesDir = await gates.getDirectionVector();
        const gatesPos = await gates.getPosition();
        const closePoint = new Vector2d(gatesPos.x+gatesDir.x*20, gatesPos.y+gatesDir.y*20);
        const farPoint = new Vector2d(gatesPos.x+gatesDir.x*30, gatesPos.y+gatesDir.y*30);
        return [closePoint,farPoint];
    }
    private async _chaseQuaffle(quaffle: IActor) {
        const quaffleJoints = await quaffle.getJoints();
        const quafflePos = await quaffle.getPosition();

        if (quaffleJoints.length > 0) {
            const quaffleHolder = quaffleJoints[0] as IActor;
            const quaffleHolderTeam = this._gameManager.getActorTeam(quaffleHolder);
            const actor = this.getActor() as IActor
            const ourTeam = this._gameManager.getActorTeam(actor);
            if (quaffleHolderTeam !== ourTeam) {
                const playerTeam = await this._gameManager.getTeamByPlayer(actor);
                const closestPlayer = await this._gameManager.getClosestTarget(quaffle, playerTeam, this._zone);
                if (closestPlayer === actor) {
                    this.setPatrolling(false);
                    const chasePos = await quaffleHolder.getPosition();
                    const dirVec = await quaffleHolder.getDirectionVector();
                    await this._targetPointer.setTargetPoint(new Vector2d(chasePos.x - dirVec.x * 2 * (Math.random() - 1), chasePos.y - dirVec.y * 2 * (Math.random() -1)));
                } else {
                    this.setPatrolling(true);
                }


            } else {
                this.setPatrolling(true);
            }

        } else {
            const actor = this.getActor() as IActor
            const playerTeam = await this._gameManager.getTeamByPlayer(actor);
            const closestPlayer = await this._gameManager.getClosestTarget(quaffle, playerTeam, this._zone);
            if (closestPlayer === actor) {
            this.setPatrolling(false);
            await this._targetPointer.setTargetPoint(quafflePos);
            }else{
                this.setPatrolling(true);
            }
        }
    }

    getActor(): PlayerActor | undefined {
        return this._targetPointer.getActor() as PlayerActor;
    }

    public getActorController():ActorController<GameInputActions, IActor>{
        return this._targetPointer.getActorController();
    }
    public getTargetPointer():ITargetPointer<Vector2d, GameInputActions, IActor>{
        return this._targetPointer;
    }
    private _isControlled:boolean = false;
    public setIsControlled(control:boolean, playerId?: string){
        this._isControlled = control;
        if(this._isControlled){
            this._targetPointer.setTargetPoint(undefined);
        }
        this.getActor()?.setIsControlled(control, playerId);

    }
  
}