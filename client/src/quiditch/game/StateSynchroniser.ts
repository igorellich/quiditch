import { ITickable } from "@common/engine/ITickable";

import {ActorState} from "@common/engine/ActorState"
import { ActorNames } from "@common/quiditch/constants";
import { PlayerState } from "@common/quiditch/PlayerState.ts";
import { MeshBasedActor } from "../../engine/MeshBasedActor";
import { ThreeMeshFactory } from "../three/factory/ThreeMeshFactory";
import { IActor } from "@common/engine/IActor";

export class StateSynchroniser implements ITickable {
    private _states: ActorState[] = [];
    private _meshesMap: { [id: string]: MeshBasedActor } = {};

    private _statesUpdated: boolean = true;

    private readonly _meshFactory: ThreeMeshFactory;
    constructor(meshFactory: ThreeMeshFactory) {
        this._meshFactory = meshFactory;

    }
    public setStates(states: ActorState[]): void {

        if (this._statesUpdated && !this._syncStarted) {
            //console.log("update states");         
            this._states = states;
            this._statesUpdated = false;

        }
    }
    _syncStarted: boolean = false;
    private async _syncStates(): Promise<void> {

        if (!this._statesUpdated && !this._syncStarted) {
            this._syncStarted = true;
            //console.log("sync States");
            for (const state of this._states) {
                let meshActor = this._meshesMap[state.id as string]
                if (!meshActor) {
                    switch (state.name) {
                        case ActorNames.player:
                            const playerState = state as PlayerState;
                            meshActor = await this._meshFactory.createPlayer(playerState.color, state.id);
                            this._meshesMap[state.id as string] = meshActor;


                            //const poiner = await this._meshFactory.createPointer(ball, meshActor, Math.random().toString());


                            break;

                        case ActorNames.quaffle:
                            meshActor = await this._meshFactory.createQuaffle(state.id);
                            this._meshesMap[state.id as string] = meshActor;
                            break;
                        case ActorNames.gates:
                            meshActor = await this._meshFactory.createGates(2, state.id);
                            this._meshesMap[state.id as string] = meshActor;
                            break;
                        case ActorNames.walls:
                            meshActor = await this._meshFactory.createWalls(state.id);
                            this._meshesMap[state.id as string] = meshActor;
                            break;
                    }
                }
                if (meshActor) {
                    await meshActor.setState(state);
                }
            }
            this._statesUpdated = true
            this._syncStarted = false
        }
    }

    public getActorById(id:string):IActor{
        return this._meshesMap[id];
    }
    public getActorByName(name:ActorNames):IActor|undefined{
        for(const id in this._meshesMap){
            const a = this._meshesMap[id];
            if(a.getName()===name){
                return a;
            }
        }
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        await this._syncStates();
    }
}