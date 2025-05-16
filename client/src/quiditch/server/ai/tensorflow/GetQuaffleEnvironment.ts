import { ActorState } from "@common/ActorState";
import { GameInputActions } from "../../../common/constants";
import { PlayerState } from "../../../common/PlayerState";
import { QuiditchGameManager } from "../../game/QuiditchGameManager";
import { IEnvironment } from "./IEnvironment";
import { Vector2d } from "@common/Vector2d";

export class GetQuaffleEnvironment implements IEnvironment<GetQuaffleGameState> {
    private _gameManager: QuiditchGameManager;
    private readonly _clientId: string;
    private readonly _reset:()=>Promise<QuiditchGameManager>;
    _gameActionsMap: GameInputActions[] = [
    GameInputActions.moveBackward, GameInputActions.moveForward, GameInputActions.turnLeft, GameInputActions.turnRight];
    constructor(clientId: string, gameManager: QuiditchGameManager, reset:()=>Promise<QuiditchGameManager>) {
        this._gameManager = gameManager;
        this._clientId = clientId;
        this._reset = reset;
    }
    getStateShape(): number {
        return 12; // Object.keys(PlayerState).length + Object.keys(ActorState).length;
    }
    async getFlatState(state:GetQuaffleGameState): Promise<any[]> {
        let result: any[] = [];
        
        if (state) {
            result = state.map(o => Object.values(o as object));
        }
        result = result.flat();
        result = result.map(o =>typeof(o)==="object"?Object.values(o as object):o);
        return result.flat();
    }
    
    private async _getState():Promise<GetQuaffleGameState>{
            const playerChaser = this._gameManager.getChaserByPlayerId(this._clientId);
            const quaffle = await this._gameManager.getQuaffle();
           return [await playerChaser?.getActor()?.getState() as PlayerState,await quaffle?.getState() as ActorState];
    }
    getActionsCount(): number {
       return this._gameActionsMap.length;
    }
    
    private _prevDistance: number|undefined;
    async step(action: number): Promise<{ reward: number; done: boolean; state: GetQuaffleGameState; }> {
        return new Promise(async (resolve, reject) => {
            const playerChaser = this._gameManager.getChaserByPlayerId(this._clientId);
            const quaffle = await this._gameManager.getQuaffle();

            let reward = 0;
            let done = false;
            if (playerChaser) {

                const actorController = playerChaser.getActorController();
                console.log(this._gameActionsMap[action])
                await actorController.applyAction(this._gameActionsMap[action], true);
                setTimeout(async () => {
                    await actorController.applyAction(this._gameActionsMap[action], false);
                    setTimeout(async () => {
                        const endDistance = (await playerChaser?.getActor()?.getPosition())?.distanceTo(await quaffle?.getPosition() as Vector2d);
                        if (this._prevDistance !== undefined && endDistance !== undefined) {
                            console.log(`${this._prevDistance.toFixed(5)}-${endDistance.toFixed(5)}`)
                            if(this._prevDistance.toFixed(5) > endDistance.toFixed(5)){
                                reward = 1;
                            }
                            if(this._prevDistance.toFixed(5) < endDistance.toFixed(5)){
                                reward = -1;
                            }

                        }
                        this._prevDistance = endDistance;
                        const playerState = await playerChaser.getActor()?.getState();
                        if (playerState) {
                            if (playerState.hasQuaffle) {
                                done = true;
                            }
                        }
                        resolve({ done, reward, state: [await playerChaser?.getActor()?.getState() as PlayerState, await quaffle?.getState() as ActorState] });
                    }, 30)

                    
                }, 30)



            }


        })

    }
    async reset(): Promise<GetQuaffleGameState> {
           this._gameManager  = await this._reset();
           // await this._gameManager.initQuaffleEnvironment(this._clientId);
          return this._getState();
       }

}
export type GetQuaffleGameState = [PlayerState?, ActorState?];