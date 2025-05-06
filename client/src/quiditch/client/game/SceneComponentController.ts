import { Scene } from "three";
import { ThreeSceneManager } from "../../../engine/client/three/ThreeSceneManager";
import { ThreeStats } from "../../../engine/client/three/threeStats";
import { ThreeMeshFactory } from "../three/factory/ThreeMeshFactory";
import { StateSynchroniser } from "./StateSynchroniser";
import { HttpServerCommunicator } from "./HttpServerCommunicator";
import { KeyboardInputController } from "../controls/KeyboardInput";
import { GameInputActions } from "../../common/constants";
import { IServerCommunicator } from "./IServerCommunicator";
import { MatchState } from "../../common/MatchState";
import { LocalServerCommunicator } from "./LocalServerCommunicator";
import { BaseState } from "@common/BaseState";

export class SceneComponentController {
    private _stateSynchroniser?: StateSynchroniser;
    private _clientId:string|undefined;
    private _controlledActorId:string|undefined;
    constructor(canvas: HTMLCanvasElement, onInit?: () => void, onStatesChange?:(states:BaseState[])=>void) {
        this._init(canvas).then(() => {
            if (onStatesChange) {
                this._stateSynchroniser?.addOnStatesChangeHandler((states) => onStatesChange(states))
            }
            if (onInit) {
                onInit();
            }
        });
    }
   
    private _serverCommunicator?: IServerCommunicator;
    public startMoving(x: number, y: number): void {
        if (this._clientId) {
            this._serverCommunicator?.startDirectionMoving(this._clientId, x, y);
        }
    }
    public stopMoving(): void {
        if (this._clientId) {
            this._serverCommunicator?.endDirectionMoving(this._clientId as string);
        }
    }
    public attack(): void {
        if (this._clientId) {
            this._serverCommunicator?.applyAction(this._clientId as string,GameInputActions.attack,true);
        }
    }

    public async getMatchState():Promise<MatchState>{
        if(this._stateSynchroniser){
        return this._stateSynchroniser.getStates().filter(s => (s as MatchState).score)[0] as MatchState;
        }else{
            return new MatchState();
        }
    }
    
    private async _init(canvas: HTMLCanvasElement): Promise<void> {
        this._clientId = window.localStorage.getItem("clientId") as string;
        if (!this._clientId) {
            this._clientId = Math.random().toString();
            window.localStorage.setItem("clientId", this._clientId);
        }
        const keyboardInputController = new KeyboardInputController<GameInputActions>({
            pause: { keys: ['p'], single: true },
            attack: { keys: [' '], single: true },
            moveBackward: { keys: ['s'], single: false },
            moveForward: { keys: ['w'], single: false },
            turnLeft: { keys: ['a'], single: false },
            turnRight: { keys: ['d'], single: false }
        });
        const scene = new Scene();
        const threeSceneManager = new ThreeSceneManager({ height: canvas.offsetHeight, width: canvas.offsetWidth }, canvas, scene);
        if (threeSceneManager) {
            threeSceneManager.startTime();
            const stats = new ThreeStats(document.body);
            threeSceneManager.addTickable(stats);
            const meshFactory = new ThreeMeshFactory(threeSceneManager, 5, 1);
            await meshFactory.createWalls();
            meshFactory.createGround().then(plane=>{
                if (plane) {
                    threeSceneManager.addTickable(plane);
                }
            });
            this._stateSynchroniser = new StateSynchroniser(meshFactory, threeSceneManager);

            threeSceneManager.addTickable(this._stateSynchroniser);

            this._serverCommunicator = new LocalServerCommunicator(this._stateSynchroniser);
            //this._serverCommunicator = new HttpServerCommunicator(this._stateSynchroniser, clientId);

            
            await this._serverCommunicator.init();
            this._controlledActorId = await this._serverCommunicator.takeControl(this._clientId);
            if (this._controlledActorId) {
                setTimeout(() => {
                    if (this._controlledActorId) {
                        const playerMesh = this._stateSynchroniser?.getActorById(this._controlledActorId);
                        if (playerMesh) {
                            threeSceneManager.setCameraTarget(playerMesh);
                        }
                    }
                }, 200)

            }





            threeSceneManager.addTickable(this._serverCommunicator);

            keyboardInputController.addOnInputChangeHandler(async (action, started) => {
                if (this._serverCommunicator) {
                    await this._serverCommunicator.applyAction(this._clientId as string, action, started);
                }
            });
        }
    }
}