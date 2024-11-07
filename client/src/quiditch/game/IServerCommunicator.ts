

import { ITickable } from "@common/engine/ITickable";
import { GameInputActions } from "@common/quiditch/constants";

export interface IServerCommunicator extends ITickable{
    startDirectionMoving(clientId:string, x:number, y:number):void;

    endDirectionMoving(clientId:string):void;

    applyAction(clientId: string, action:GameInputActions, started:boolean):Promise<void>;

    takeControl(clientId:string):Promise<string|undefined>;
}