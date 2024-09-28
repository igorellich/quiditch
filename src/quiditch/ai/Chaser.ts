import { Vector2d } from "../../engine/base/Vector2d";
import { Patroller } from "../../engine/ai/palyers/Patroller";
import { Quaffle } from "../factory/MB/components/balls/Quaffle";
import { PlayerActor } from "../factory/MB/components/PlayerActor";
import { IZone } from "../../engine/ai/zone/IZone";
import { ITargetPointer } from "../controls/ITargetPointer";
import { IActor } from "../../engine/base/Actor/IActor";
import { normaliseAngle } from "../../utils/geometryUtils";
import { GameManager } from "../game/GameManager";
import { ActorController } from "../../engine/controls/ActorController";
import { GameInputActions } from "../constants";

export class Chaser extends Patroller<Vector2d> {
    private readonly _gameManager: GameManager;
    constructor(zone: IZone<Vector2d>, targetPointer: ITargetPointer<Vector2d, GameInputActions, IActor>, reachInterval: number, gameManager: GameManager) {
        super(zone, targetPointer, reachInterval);
        this._gameManager = gameManager;

    }

  
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
                        this.setPatrolling(true);
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
        const joints = await quaffle.getJoints();
        const quafflePos = await quaffle.getPosition();

        if (joints.length > 0) {
           
            const quaffleHolderTeam = this._gameManager.getActorTeam(joints[0] as IActor);
            const actor = this.getActor() as IActor
            const ourTeam = this._gameManager.getActorTeam(actor);
            if (quaffleHolderTeam !== ourTeam) {
                const playerTeam = await this._gameManager.getTeamByPlayer(actor);
                const closestPlayer = await this._gameManager.getClosestTarget(quaffle, playerTeam, this._zone);
                if (closestPlayer === actor) {
                    this.setPatrolling(false);
                    const jpointPos = await quaffle.getPosition();
                    const dirVec = await quaffle.getDirectionVector();
                    await this._targetPointer.setTargetPoint(new Vector2d(jpointPos.x - dirVec.x * 10 * Math.random(), jpointPos.y - dirVec.y * 10 * Math.random()));
                } else {
                    this.setPatrolling(true);
                }


            } else {
                this.setPatrolling(true);
            }

        } else {
            this.setPatrolling(false);
            await this._targetPointer.setTargetPoint(quafflePos);
        }
    }

    getActor(): IActor | undefined {
        return this._targetPointer.getActor();
    }

    public getActorController():ActorController<GameInputActions, IActor>{
        return this._targetPointer.getActorController();
    }
    public getTargetPointer():ITargetPointer<Vector2d, GameInputActions, IActor>{
        return this._targetPointer;
    }
    private _isControlled:boolean = false;
    public setIsControlled(control:boolean){
        this._isControlled = control;
        if(this._isControlled){
            this._targetPointer.setTargetPoint(undefined);
        }
    }
}