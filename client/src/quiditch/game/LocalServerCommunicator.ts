// import { Vector2d } from "../../engine/base/Vector2d";
// import { Chaser } from "../ai/Chaser";
// import { GameInputActions } from "../constants";
// import { TargetPointInputController } from "../controls/TargetPointInputController";
// import { PlayerActor } from "../factory/MB/components/PlayerActor";
// import { GameManager } from "./GameManager";
// import { IServerCommunicator } from "./IServerCommunicator";
// import { StateSynchroniser } from "./StateSynchroniser";

// export class LocalServerCommunicator implements IServerCommunicator{
//     private readonly _gameManager:GameManager;

//     private readonly _stateSync:StateSynchroniser;
//     constructor(gameManager:GameManager, stateSync:StateSynchroniser){
//         this._gameManager = gameManager;
//         this._stateSync = stateSync;
//     }

//     public async applyAction(clientId: string, action:GameInputActions, started:boolean):Promise<void>{
//         const playerChaser = this._getPlayerChaser(clientId);
//         if (playerChaser) {
//             const actorController = playerChaser.getActorController();
//             await actorController.applyAction(action,started);
//         }
//     }

//     endDirectionMoving(clientId: string): void {
//         const playerChaser = this._getPlayerChaser(clientId);
//         const targetPointer = playerChaser?.getTargetPointer();
//         if (targetPointer) {
//             targetPointer.setTargetPoint(undefined);
//         }

//     }
//     async startDirectionMoving(clientId: string, x: number, y: number): Promise<void> {
//         const playerChaser = this._getPlayerChaser(clientId)
//         if (playerChaser) {
//             const player = playerChaser?.getActor() as PlayerActor;
//             if (player) {

//                 if (player?.getIsControlled()) {
//                     const playerPos = await player.getPosition();
//                     const targetPointer = playerChaser?.getTargetPointer();
//                     if (targetPointer) {
//                         targetPointer.setTargetPoint(new Vector2d(playerPos.x + x * 1000, playerPos.y + y * 1000));
//                     }

//                 }
//             }
//         }
//     }

//     private _getPlayerChaser(playerId:string):Chaser{
//        return this._gameManager.getChasers().filter(c => c.getActor()?.getIsControlled() && c.getActor()?.getPlayerId() == playerId)[0];
       
//     }
//     takeControl(clientId:string):string|undefined{
        
//         const freeChaser =  this._gameManager.getChasers().filter(c=>c.getActor()?.getIsControlled()===false)[0];
//         if(freeChaser){
//             this._gameManager.setPlayerChaser(freeChaser, clientId);
//             return freeChaser.getActor()?.getId();
//         }
       
//     }   
   
//     async tick(elapsedTime: number, deltaTime: number): Promise<void> {
//         this._stateSync.setStates(this._gameManager.getStates());
//     }
  

// }