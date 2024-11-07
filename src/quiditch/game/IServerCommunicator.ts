import { ActorState } from "../../engine/base/Actor/Actor";
import { ITickable } from "../../engine/base/ITickable";
import { GameInputActions } from "../constants";

export interface IServerCommunicator extends ITickable{
    startDirectionMoving(clientId:string, x:number, y:number):void;

    endDirectionMoving(clientId:string):void;

    applyAction(clientId: string, action:GameInputActions, started:boolean):Promise<void>;

    takeControl(clientId:string):Promise<string|undefined>;
}