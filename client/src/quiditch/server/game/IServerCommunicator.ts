import { ITickable } from "@common/ITickable";
import { GameInputActions } from "../../common/constants";


export interface IServerCommunicator extends ITickable{
    startDirectionMoving(clientId:string, x:number, y:number):void;

    endDirectionMoving(clientId:string):void;

    applyAction(clientId: string, action:GameInputActions, started:boolean):Promise<void>;

    takeControl(clientId:string):string|undefined;
}