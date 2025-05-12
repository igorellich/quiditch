

import { ITickable } from "@common/ITickable";
import { GameInputActions } from "../../common/constants";
import { BaseState } from "@common/BaseState";

export interface IServerCommunicator extends ITickable{
    startDirectionMoving(clientId:string, x:number, y:number):void;

    endDirectionMoving(clientId:string):void;

    applyAction(clientId: string, action:GameInputActions, started:boolean):Promise<void>;

    takeControl(clientId:string):Promise<string|undefined>;
    init(states?:BaseState[]):Promise<void>;

    reset():Promise<void>
    setPause(pause:boolean):Promise<void>
}