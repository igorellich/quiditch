import { ActorState } from "@common/ActorState";
import { GameInputActions } from "../../../common/constants";
import { PlayerState } from "../../../common/PlayerState";
import { QuiditchGameManager } from "../../game/QuiditchGameManager";
import { IEnvironment } from "./IEnvironment";
import { Vector2d } from "@common/Vector2d";
import { Actor } from "@common/Actor";
import { PlayerActor } from "../../factory/components/PlayerActor";
import { normaliseAngle } from "@common/utils/geometryUtils";

export class GetQuaffleEnvironment implements IEnvironment<GetQuaffleGameState> {
    private _gameManager: QuiditchGameManager|undefined;
    private readonly _clientId: string;
    private readonly _reset:()=>Promise<QuiditchGameManager>;
    _gameActionsMap: GameInputActions[] = [
    //GameInputActions.moveBackward,
     GameInputActions.moveForward, GameInputActions.turnLeft, GameInputActions.turnRight];
    constructor(clientId: string,  reset:()=>Promise<QuiditchGameManager>) {
        
        this._clientId = clientId;
        this._reset = reset;
    }
    getStateShape(): number {
        return 4; // Object.keys(PlayerState).length + Object.keys(ActorState).length;
    }
    async getFlatState(state:GetQuaffleGameState): Promise<any[]> {
        return state;
        // let result: any[] = [];
        
        // if (state) {
        //     result = state.map(o => Object.values(o as object));
        // }
        // result = result.flat();
        // result = result.map(o =>typeof(o)==="object"?Object.values(o as object):o);
        // return result.flat();
    }
    
    private async _getState():Promise<GetQuaffleGameState>{
            const playerChaser = this._gameManager?.getChaserByPlayerId(this._clientId);
            const chaserActor = playerChaser?.getActor() as PlayerActor; 
            const quaffle = await this._gameManager?.getQuaffle();
            const quafflePos = await quaffle?.getPosition() as Vector2d;
            const angle = await chaserActor?.getAngelToTarget(quafflePos);
            const position = await chaserActor?.getPosition() as Vector2d;
            const distance = position.distanceTo(quafflePos);
           return [position.x, position.y, distance, angle];
    }
    getActionsCount(): number {
       return this._gameActionsMap.length;
    }
    
    private minAngle: number|undefined;
    async step(action: number): Promise<{ reward: number; done: boolean; state: GetQuaffleGameState; }> {
        return new Promise(async (resolve, reject) => {
            const playerChaser = this._gameManager?.getChaserByPlayerId(this._clientId);
            const quaffle = await this._gameManager?.getQuaffle();

            let reward = -0.1;
            let done = false;
            if (playerChaser) {

                const actorController = playerChaser.getActorController();
                const currState = await this._getState();
                //console.log(this._gameActionsMap[action])
                await actorController.applyAction(this._gameActionsMap[action], true);
                setTimeout(async () => {
                    await actorController.applyAction(this._gameActionsMap[action], false);
                    setTimeout(async () => {
                        const newState = await this._getState();
                        if (newState[2] < currState[2]) {
                            reward += 1;
                        }

                        if (newState[2] > currState[2]) {
                            reward += -1;
                        }
                        // if (Math.abs(normaliseAngle(newState[3])) < 0.05) {
                        //     reward += 5;
                        // } else {
                            if (Math.abs(normaliseAngle(newState[3])) < Math.abs(normaliseAngle(currState[3])) || Math.abs(normaliseAngle(newState[3])) < 0.05) {
                                reward += 0.5;
                            }
                            if (Math.abs(normaliseAngle(newState[3]) )> Math.abs(normaliseAngle(currState[3]))) {
                                reward += -0.5;
                            }
                        //}
                        if(!this.minAngle||this.minAngle>Math.abs(normaliseAngle(newState[3]))){
                            this.minAngle = Math.abs(normaliseAngle(newState[3]));
                        }
                        //console.log(newState[2],this.minAngle, Math.abs(normaliseAngle(newState[3])), Math.abs(normaliseAngle(currState[3])));
                        const playerState = await playerChaser.getActor()?.getState();
                        if (playerState) {
                            if (playerState.hasQuaffle) {
                                done = true;
                            }
                        }
                        // if(newState[2]<5){
                        //     done = true;
                        // }
                        resolve({ done, reward, state: await this._getState() });
                    }, 1/500)

                    
                },1/500)



            }


        })

    }
    async reset(): Promise<GetQuaffleGameState> {
           this._gameManager  = await this._reset();
           // await this._gameManager.initQuaffleEnvironment(this._clientId);
          return this._getState();
       }

}
export type GetQuaffleGameState = [x:number, y:number, distance: number, angle:number];