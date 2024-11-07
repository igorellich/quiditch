import { GameInputActions } from "@common/quiditch/constants";
import { IServerCommunicator } from "./IServerCommunicator";
import { StateSynchroniser } from "./StateSynchroniser";

export class HttpServerCommunicator implements IServerCommunicator{
    private readonly _stateSync:StateSynchroniser
    constructor(stateSync:StateSynchroniser){
        this._stateSync = stateSync;
    }
    startDirectionMoving(clientId: string, x: number, y: number): void {
        //throw new Error("Method not implemented.");
    }
    endDirectionMoving(clientId: string): void {
        //throw new Error("Method not implemented.");
    }
    async applyAction(clientId: string, action: GameInputActions, started: boolean): Promise<void> {
        //throw new Error("Method not implemented.");
    }
    takeControl(clientId: string): Promise<string | undefined> {
        return new Promise((res, rej)=>{
            const req = new XMLHttpRequest();
            
            req.open("POST","http://localhost:3000/control");
            req.onload = ()=>{
               
                res(req.response);
            }
            req.send(JSON.stringify({id:clientId}));
        })
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        return new Promise((res, rej)=>{
            const req = new XMLHttpRequest();
            req.open("GET","http://localhost:3000/state");
            req.onload = ()=>{
                this._stateSync.setStates(JSON.parse(req.response));
                res();
            }
            req.send();
        })
      
    }
    
}