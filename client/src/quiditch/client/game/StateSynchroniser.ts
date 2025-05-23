import { ITickable } from "@common/ITickable";
import { IActor } from "@common/IActor";
import { BaseState } from "@common/BaseState";
import { ActorState } from "@common/ActorState"
import { ActorNames } from "../../common/constants";
import { PlayerState } from "../../common/PlayerState";

import { MeshBasedActor } from "../../../engine/client/MeshBasedActor";
import { IQuiditchFactory } from "../../common/IQuiditchActorFactory";
import { SceneManager } from "../../../engine/client/SceneManager";
import { MatchState } from "../../common/MatchState";

import { startPause, stopPause } from "../../react/store/pauseSlice";
import store from "../../react/store/store";



export class StateSynchroniser implements ITickable {
    private _states: BaseState[] = [];
    private _meshesMap: { [id: string]: MeshBasedActor } = {};

    private _statesUpdated: boolean = true;

    private readonly _meshFactory: IQuiditchFactory<MeshBasedActor>;

    private readonly _sceneManager: SceneManager;

    constructor(meshFactory: IQuiditchFactory<MeshBasedActor>, sceneManager: SceneManager) {
        this._meshFactory = meshFactory;
        this._sceneManager = sceneManager;
        
    }

    private readonly _statesChangeHandlers: ((states: BaseState[]) => void)[] = [];
    public addOnStatesChangeHandler(handler: (states: BaseState[]) => void): void {
        this._statesChangeHandlers.push(handler);
    }

    public setStates(states: BaseState[]): void {

        if (this._statesUpdated && !this._syncStarted) {

            this._states = states;
            this._statesUpdated = false;
            for (let handler of this._statesChangeHandlers) {
                handler(this._states);
            }

        }
    }
    _syncStarted: boolean = false;
    public async syncStates(): Promise<void> {

        if (!this._statesUpdated && !this._syncStarted) {
            this._syncStarted = true;
            await this._syncActorStates();
            this._syncMatchState();
            this._statesUpdated = true
            this._syncStarted = false

        }
    }

    public getActorById(id: string): IActor {
        return this._meshesMap[id];
    }
    public getActorByName(name: ActorNames): IActor | undefined {
        for (const id in this._meshesMap) {
            const a = this._meshesMap[id];
            if (a.getName() === name) {
                return a;
            }
        }
    }
    public getMatchState(): MatchState | undefined {
        return this._states.filter(s => s.name === "match")[0] as MatchState;
    }

    public getActorStates(): ActorState[] {
        return this._states.filter(s => (s as ActorState).id) as ActorState[];
    }

    private async _syncActorStates() {
        const actorStates = this.getActorStates();
        for (let meshId in this._meshesMap) {
            if (actorStates.findIndex(s => s.id === meshId) < 0) {
                this._sceneManager.removeTickable(this._meshesMap[meshId])
                this._meshFactory.remove(this._meshesMap[meshId]);
            }
        }
        for (const actorSate of actorStates) {

            let meshActor = this._meshesMap[actorSate.id as string]
            if (!meshActor) {
                switch (actorSate.name) {
                    case ActorNames.player:
                        const playerState = actorSate as PlayerState;
                        meshActor = await this._meshFactory.createPlayer(playerState.color, actorSate.id);
                        this._meshesMap[actorSate.id as string] = meshActor;
                        break;

                    case ActorNames.quaffle:
                        meshActor = await this._meshFactory.createQuaffle(actorSate.id);
                        this._meshesMap[actorSate.id as string] = meshActor;
                        break;
                    case ActorNames.gates:
                        meshActor = await this._meshFactory.createGates(2, actorSate.id);
                        this._meshesMap[actorSate.id as string] = meshActor;
                        break;
                    case ActorNames.walls:
                        meshActor = await this._meshFactory.createWalls(actorSate.id);
                        this._meshesMap[actorSate.id as string] = meshActor;
                        break;
                }
            }
            if (meshActor) {
                await meshActor.setState(actorSate);
            }

        }
    }

    private _syncMatchState() {
        const matchState = this.getMatchState();
        if (matchState) {
            store.dispatch(matchState?.paused?startPause():stopPause())
        }
    }

    public getStates(): BaseState[] {
        return [...this._states];
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        await this.syncStates();
    }
}