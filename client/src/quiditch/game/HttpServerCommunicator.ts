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
        return new Promise((res, rej)=>{
           fetch("http://localhost:3000/action",{
            method:"POST",
            headers:{
                'Content-Type':"application/json;charset=utf-8"
            },
            body:JSON.stringify({id:clientId, action, started})
           }).then(r=>res());
        })
    }
    takeControl(clientId?: string): Promise<string | undefined> {
        return new Promise((res, rej)=>{
            fetch("http://localhost:3000/control",{
             method:"POST",
             headers:{
                 'Content-Type':"application/json;charset=utf-8"
             },
             body:JSON.stringify({id:clientId||""})
            }).then(r=>res(r.json()));
         })
    }
    private lastUpdateTime:number=0;
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        if (this.lastUpdateTime > 0.01) {
            this.lastUpdateTime = 0;
            return new Promise((res, rej) => {
                let start = Date.now()
                const req = new XMLHttpRequest();
                req.open("GET", "http://localhost:3000/state");
                req.onload = () => {
                    //console.log(Date.now() - start);
                    this._stateSync.setStates(JSON.parse(req.response));
                    //console.log(Date.now()-start);

                    res();
                }
                req.send();
            })
        }else{
            this.lastUpdateTime+=deltaTime;
        }

    }
    
}