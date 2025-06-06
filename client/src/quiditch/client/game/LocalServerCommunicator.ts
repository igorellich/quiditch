import { Vector2d } from "@common/Vector2d";
import { Chaser } from "../../server/ai/Chaser";
import { GameInputActions } from "../../common/constants";
import { PlayerActor } from "../../server/factory/components/PlayerActor";

import { IServerCommunicator } from "./IServerCommunicator";
import { StateSynchroniser } from "./StateSynchroniser";
import { World } from "@dimforge/rapier2d-compat";
import { RapierBodyFactory } from "../../server/factory/rapier/RapierBodyFactory";
import { RapierPhysicsManager } from "../../../engine/server/rapier/RapierPhysicsManager";
import { QuiditchFactory } from "../../server/factory/QuiditchActorFactory";
import { QuiditchGameManager } from "../../server/game/QuiditchGameManager";
import { BaseState } from "@common/BaseState";
import { GetQuaffleEnvironment } from "../../server/ai/tensorflow/GetQuaffleEnvironment";
import { AgentManager } from "../../server/ai/tensorflow/test";

export class LocalServerCommunicator implements IServerCommunicator {
    private _gameManager?: QuiditchGameManager;

    private readonly _stateSync: StateSynchroniser;

    private  _quiditchFactory?:QuiditchFactory;
    private  _physicsManager?:RapierPhysicsManager;
    private readonly _clientId:string;
    private readonly _mode:string;

    private _world:World;
    constructor(stateSync: StateSynchroniser, mode:string, clientId: string) {
        this._mode = mode;
        this._clientId = clientId;
        this._stateSync = stateSync;
         const gravity = { x: 0.0, y: 0.0 };
         this._world = new World(gravity);
        
        const bodyFactory = new RapierBodyFactory(this._world);
        this._physicsManager = new RapierPhysicsManager(this._world);
        this._quiditchFactory = new QuiditchFactory(bodyFactory, this._physicsManager);
        this._gameManager = new QuiditchGameManager(this._quiditchFactory, this._physicsManager, 100);
        
        
    }
    async getStates(): Promise<BaseState[]> {
        return this._gameManager?.getStates() || []
    }
    async setPause(pause: boolean): Promise<void> {

        this._gameManager?.setPause(pause);
    }
    async reset(duration?: number): Promise<void> {
        if (this._world) {
            this._world.free();
        }
        const gravity = { x: 0.0, y: 0.0 };
        this._world = new World(gravity);

        const bodyFactory = new RapierBodyFactory(this._world);
        this._physicsManager = new RapierPhysicsManager(this._world);
        this._quiditchFactory = new QuiditchFactory(bodyFactory, this._physicsManager);
        this._gameManager = new QuiditchGameManager(this._quiditchFactory, this._physicsManager, duration);
        await this._gameManager.init();
    }

    public async applyAction(clientId: string, action: GameInputActions, started: boolean): Promise<void> {
        if (this._gameManager && action === GameInputActions.pause) {
            this._gameManager.setPause(!this._gameManager.getPause());
        } else {
           // console.log(clientId, action, started)
            const playerChaser = this._getPlayerChaser(clientId);
            if (playerChaser) {
                const actorController = playerChaser.getActorController();
                await actorController.applyAction(action, started);
            }
        }
    }

    endDirectionMoving(clientId: string): void {
        const playerChaser = this._getPlayerChaser(clientId);
        const targetPointer = playerChaser?.getTargetPointer();
        if (targetPointer) {
            targetPointer.setTargetPoint(undefined);
        }

    }
    async startDirectionMoving(clientId: string, x: number, y: number): Promise<void> {
        console.log(clientId)
        const playerChaser = this._getPlayerChaser(clientId)
        if (playerChaser) {
            const player = playerChaser?.getActor() as PlayerActor;
            if (player) {

                if (player?.getIsControlled()) {
                    const playerPos = await player.getPosition();
                    const targetPointer = playerChaser?.getTargetPointer();
                    if (targetPointer) {
                        targetPointer.setTargetPoint(new Vector2d(playerPos.x + x * 1000, playerPos.y + y * 1000));
                    }

                }
            }
        }
    }

    private _getPlayerChaser(playerId: string): Chaser|null {
        return this._gameManager?.getChasers().filter(c => c.getActor()?.getIsControlled() && c.getActor()?.getPlayerId() == playerId)[0]||null;

    }
    async takeControl(clientId: string): Promise<string | undefined> {

        const freeChaser = this._gameManager?.getChasers().filter(c => c.getActor()?.getIsControlled() === false)[0];
        if (freeChaser) {
            this._gameManager?.setPlayerChaser(freeChaser, clientId);
            return freeChaser.getActor()?.getId();
        }

    }

    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        this._stateSync.setStates(this._gameManager?.getStates()||[]);

    }
    public init(initStates: BaseState[]): Promise<void> {
        return new Promise(async res => {
            // this._gameManager?.setPause(true);
            switch (this._mode) {
                case "getQuaffle":
                    await this._gameManager?.initQuaffleEnvironment(this._clientId);
                    // отрисовываем states
                    this._gameManager?.setPause(false);
                    const getQuaffleEnv = new GetQuaffleEnvironment(this._clientId, async () => {
                        await this.reset();
                        return this._gameManager as QuiditchGameManager;
                    })
                    const agentManager = new AgentManager(getQuaffleEnv);
                    agentManager.trainAgent();
                    break;
                default:
                    await this._gameManager?.init(initStates);
                    break;
            }

           
            setTimeout(async ()=>{
                 this._gameManager?.setPause(true);
                
                res();
                 
            },10)
           
        })
   
    }
}