import { ActorState } from "../../engine/base/Actor/Actor";
import { ITickable } from "../../engine/base/ITickable";

export interface IServerCommunicator extends ITickable{
    startDirectionMoving(clientId:string, x:number, y:number):void;

    endDirectionMoving(clientId:string):void;

    attack(clientId:string):void;

    takeControl(clientId:string):string|undefined;
}