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

export class SceneController {
    getServerCommunicator(): IServerCommunicator | undefined {
        return this._serverCommunicator;
    }
    private _stateSynchroniser?: StateSynchroniser;
    private _clientId: string | undefined;
    private _controlledActorId: string | undefined;

    private _threeSceneManager: ThreeSceneManager;

    private readonly _initStates: BaseState[] | undefined;
    constructor(canvas: HTMLCanvasElement, clientId: string, onInit?: () => void, onStatesChange?: (states: BaseState[]) => void, initState?: BaseState[]) {
        this._initStates = initState;

        this._clientId = clientId; // window.localStorage.getItem("clientId") as string;
        // if (!this._clientId) {
        //     this._clientId = Math.random().toString();
        //     window.localStorage.setItem("clientId", this._clientId);
        // }
        const keyboardInputController = new KeyboardInputController<GameInputActions>({
            pause: { keys: ['p'], single: true },
            attack: { keys: [' '], single: true },
            moveBackward: { keys: ['s'], single: false },
            moveForward: { keys: ['w'], single: false },
            turnLeft: { keys: ['a'], single: false },
            turnRight: { keys: ['d'], single: false }
        });

        keyboardInputController.addOnInputChangeHandler(async (action, started) => {
            if (this._serverCommunicator) {
                await this._serverCommunicator.applyAction(this._clientId as string, action, started);
            }
        });
        const scene = new Scene();
        this._threeSceneManager = new ThreeSceneManager({ height: canvas.offsetHeight, width: canvas.offsetWidth }, canvas, scene);

        this._threeSceneManager.startTime();
        const stats = new ThreeStats(document.body);
        this._threeSceneManager.addTickable(stats);
        const meshFactory = new ThreeMeshFactory(this._threeSceneManager, 5, 1);
        meshFactory.createWalls();
        meshFactory.createGround().then(plane => {
            if (plane && this._threeSceneManager) {
                this._threeSceneManager.addTickable(plane);
            }
        });
        this._stateSynchroniser = new StateSynchroniser(meshFactory, this._threeSceneManager);

        this._threeSceneManager.addTickable(this._stateSynchroniser);

        this._serverCommunicator = new LocalServerCommunicator(this._stateSynchroniser);
        //this._serverCommunicator = new HttpServerCommunicator(this._stateSynchroniser, clientId);

        this._init(canvas, clientId).then(() => {
            if (onStatesChange) {
                this._stateSynchroniser?.addOnStatesChangeHandler((states) => onStatesChange(states))
            }
            if (onInit) {
                onInit();
            }
        });
    }

    private _serverCommunicator: IServerCommunicator;
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
            this._serverCommunicator?.applyAction(this._clientId as string, GameInputActions.attack, true);
        }
    }

    public async getMatchState(): Promise<MatchState> {
        if (this._stateSynchroniser) {
            return this._stateSynchroniser.getStates().filter(s => (s as MatchState).score)[0] as MatchState;
        } else {
            return new MatchState();
        }
    }
    public async setPause(pause: boolean): Promise<void> {
        await this._serverCommunicator?.setPause(pause);
    }

    public async reset(): Promise<void> {
        await this._serverCommunicator?.reset();
        await this._takeControl();
    }

    private async _init(canvas: HTMLCanvasElement, clientId: string): Promise<void> {



        await this._serverCommunicator.init(this._initStates);

        await this._takeControl();

        this._threeSceneManager.addTickable(this._serverCommunicator);



    }
    private async _takeControl() {
        if (this._serverCommunicator && this._clientId && this._stateSynchroniser && this._threeSceneManager) {
            this._controlledActorId = await this._serverCommunicator.takeControl(this._clientId);
            await this._stateSynchroniser.syncStates();
            if (this._controlledActorId) {
                setTimeout(() => {
                    if (this._controlledActorId) {
                        const playerMesh = this._stateSynchroniser?.getActorById(this._controlledActorId);
                        if (playerMesh && this._threeSceneManager) {
                            this._threeSceneManager.setCameraTarget(playerMesh);
                        }
                    }
                }, 200)

            }
        }
    }
}