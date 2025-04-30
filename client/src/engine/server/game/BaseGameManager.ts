import { ActorState } from "@common/ActorState"
import { BaseState } from "@common/BaseState"
import { IActor } from "@common/IActor";
import { ITickable } from "@common/ITickable";
import { Vector2d } from "@common/Vector2d";
import { IZone } from "src/engine/ai/zone/IZone";
import { Team } from "src/engine/game/Team";
import { IPhysicsManager } from "src/engine/base/IPhysicsManager";


export class BaseGameManager {
    protected readonly _teams: Team[] = [];
    protected readonly _tickers: ITickable[] = [];

    protected _actorStates: ActorState[] = [];

    protected _stateWatchActors: IActor[] = [];

    protected readonly _physicsManager: IPhysicsManager;

    constructor(physicsManager: IPhysicsManager) {


        this._physicsManager = physicsManager;
        this.addTickable(this._physicsManager);
        let elapsedTime = 0;
        const freq = (1 / 60) * 1000;
        this._tickInterval = setInterval(async () => {
            if (!this._pause) {
                elapsedTime += freq;
                for (const tickable of this._tickers) {
                    await tickable.tick(elapsedTime, freq);
                }
                const collisions = this._physicsManager.getCollisions(this.getActors());

                if (collisions.length > 0) {
                    collisions.forEach(c => {
                        if (c.actorB) {
                            c.actorA?.onCollision(c, elapsedTime);
                        }
                        if (c.actorA) {
                            c.actorB?.onCollision(c, elapsedTime);
                        }

                    })
                }
                const newStates = await Promise.all(this._stateWatchActors.map(a => a.getState()));
                this._actorStates = newStates;
            }
        }, freq);

    }

    public addTickable(tickable: ITickable) {
        if (!this._tickers.includes(tickable)) {
            this._tickers.push(tickable);
        }
    }

    public getStates(): BaseState[] {
        return [...this._actorStates];
    }
    protected _tickInterval: any = 0;
    public async getClosestTarget(source: IActor, targets: IActor[], zone?: IZone<Vector2d>) {
        return await this.getClosestActor(await source.getPosition(), targets, zone);
    }
    public getActorTeam(actor: IActor): Team | undefined {
        return this._teams.find(t => t.isActorInTeam(actor));
    }
    public getTeams(): Team[] {
        return [...this._teams];
    }

    public getActors(): IActor[] {
        return this._tickers.filter(t => {
            return (t as IActor).move;
        }) as IActor[];
    }
    public async getActorsByName(name: string): Promise<IActor[]> {
        const actors = await this.getActors();
        const result: IActor[] = [];
        for (const a of actors) {
            if ((await a.getName()) === name) {
                result.push(a);
            }
        }
        return result;
    }

    public async getClosestActor(sourcePos: Vector2d, targetActors: IActor[], zone?: IZone<Vector2d>): Promise<IActor | undefined> {
        let result: IActor | undefined;

        let fileredActors: IActor[] = [];
        if (zone) {
            for (const a of targetActors) {
                if (await zone.belongs(await a.getPosition())) {
                    fileredActors.push(a);
                }
            }

        } else {
            fileredActors = targetActors;
        }
        let distance: number | undefined;
        for (let a of targetActors) {
            const currDist = await sourcePos.distanceTo(await a.getPosition());
            if (!distance || currDist < distance) {
                distance = currDist;
                result = a;
            }
        }
        return result;
    }

    public getTickers(): ITickable[] {
        return [...this._tickers];
    }
    private _pause: boolean = false;
    setPause(pause: boolean) {
        this._pause = pause;
    }

    getPause(): boolean {
        return this._pause;
    }
}