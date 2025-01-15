import { Scene } from "three";
import { ThreeSceneManager } from "../../../engine/three/ThreeSceneManager";
import { ThreeStats } from "../../../engine/three/threeStats";
import { ThreeMeshFactory } from "../../three/factory/ThreeMeshFactory";
import { StateSynchroniser } from "../../game/StateSynchroniser";
import { HttpServerCommunicator } from "../../game/HttpServerCommunicator";
import { KeyboardInputController } from "../../controls/KeyboardInput";
import { GameInputActions } from "@common/quiditch/constants";
import { IServerCommunicator } from "../../game/IServerCommunicator";
import { MatchState } from "@common/quiditch/MatchState";

export class SceneComponentController {
    private _stateSynchroniser?: StateSynchroniser;

    constructor(canvas: HTMLCanvasElement, onInit?: () => void) {
        this._init(canvas).then(() => {
            if (onInit) {
                onInit();
            }
        });
    }
    private _controlledActorId?: string;
    private _serverCommunicator?: IServerCommunicator;
    public startMoving(x: number, y: number): void {
        if (this._controlledActorId) {
            this._serverCommunicator?.startDirectionMoving(this._controlledActorId, x, y);
        }
    }
    public stopMoving(): void {
        if (this._controlledActorId) {
            this._serverCommunicator?.endDirectionMoving(this._controlledActorId);
        }
    }
    public attack(): void {
        if (this._controlledActorId) {
            this._serverCommunicator?.applyAction(this._controlledActorId,GameInputActions.attack,true);
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
        let clientId: string = window.localStorage.getItem("clientId") as string;
        if (!clientId) {
            clientId = Math.random().toString();
            window.localStorage.setItem("clientId", clientId);
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
        const threeSceneManager = new ThreeSceneManager({ height: window.innerHeight, width: window.innerWidth }, canvas, scene);
        if (threeSceneManager) {
            threeSceneManager.startTime();
            const stats = new ThreeStats(document.body);
            threeSceneManager.addTickable(stats);
            const meshFactory = new ThreeMeshFactory(threeSceneManager, 5);
            await meshFactory.createWalls();
            // meshFactory.createGround().then(plane=>{
            //     if (plane) {
            //         threeSceneManager.addTickable(plane);
            //     }
            // });
            this._stateSynchroniser = new StateSynchroniser(meshFactory, threeSceneManager);

            threeSceneManager.addTickable(this._stateSynchroniser);

            //const serverCommunicator:IServerCommunicator = new LocalServerCommunicator(server, stateSync);

            this._serverCommunicator = new HttpServerCommunicator(this._stateSynchroniser);

            this._serverCommunicator.takeControl(clientId).then((controlledActorId) => {
                this._controlledActorId = controlledActorId;

            });


            threeSceneManager.addTickable(this._serverCommunicator);

            keyboardInputController.addOnInputChangeHandler(async (action, started) => {
                if (this._serverCommunicator) {
                    await this._serverCommunicator.applyAction(clientId, action, started);
                }
            });
        }
    }
}