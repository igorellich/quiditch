import { GameInputActions } from "../../common/constants";
import { IServerCommunicator } from "./IServerCommunicator";
import { StateSynchroniser } from "./StateSynchroniser";

export class HttpServerCommunicator implements IServerCommunicator{
    private readonly _stateSync:StateSynchroniser
    private readonly _serverUrl:string;
    private readonly _clientId:string;
    constructor(stateSync:StateSynchroniser, clientId:string){
        this._stateSync = stateSync;
        this._clientId = clientId;
        this._serverUrl = "http://localhost:3000"
    }
    init(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    startDirectionMoving(clientId: string, x: number, y: number): void {
        //throw new Error("Method not implemented.");
    }
    endDirectionMoving(clientId: string): void {
        //throw new Error("Method not implemented.");
    }
    async applyAction(clientId: string, action: GameInputActions, started: boolean): Promise<void> {
        return new Promise((res, rej)=>{
           fetch(`${this._serverUrl}/action`,{
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
            fetch(`${this._serverUrl}/control`,{
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
            // return new Promise((res, rej) => {
            //     //let start = Date.now()
            //     const req = new XMLHttpRequest();
            //     req.open("GET", "http://localhost:3000/state");
            //     req.onload = () => {
            //         //console.log(Date.now() - start);
            //         this._stateSync.setStates(JSON.parse(req.response));
            //         //console.log(Date.now()-start);

            //         res();
            //     }
            //     req.send();
            // })
            return new Promise(async (res, rej)=>{
                const result = await fetch(`${this._serverUrl}/state`,{
                 method:"POST",
                 headers:{
                     'Content-Type':"application/json;charset=utf-8"
                 },
                 body:JSON.stringify({id:this._clientId})
                });//.then(r=>res(r.json()));
                this._stateSync.setStates(await result.json());
             })
        }else{
            this.lastUpdateTime+=deltaTime;
        }

    }
    
}