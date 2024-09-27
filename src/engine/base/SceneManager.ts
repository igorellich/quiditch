import { IZone } from "../ai/zone/IZone";
import { Actor } from "./Actor/Actor";
import { IActor } from "./Actor/IActor";
import { IPhysicsManager, RayCastResult } from "./IPhysicsManager";
import { ITickable } from "./ITickable";
import { Vector2d } from "./Vector2d";

export abstract class SceneManager {
    private readonly _tickers: ITickable[] = [];
    private _prevTime: number = 0;
    protected _size: Size;
    protected readonly _physicsManager?: IPhysicsManager;
    constructor(size: Size, physicsManager?: IPhysicsManager) {

        this._size = size;
        this._physicsManager = physicsManager;

    }
    public abstract startTime(): void;
    public abstract stopTime(): void;
    protected abstract _getElapsedTime(): number;
    protected abstract _draw(): void;
    public async castRay(origin: Vector2d, dir: Vector2d, rayLength: number, sourceActor?: IActor): Promise<RayCastResult | undefined> {
        if (this._physicsManager) {
            return this._physicsManager.castRay(origin, dir, rayLength, sourceActor, this.getActors() as IActor[]);
        }
        return undefined;
    }



    protected async tick() {
        console.log("scene manager tick");
        const elapsedTime = this._getElapsedTime();
        const deltaTime = elapsedTime - (this._prevTime);
        this._prevTime = elapsedTime;
        for (const actor of this._tickers) {
            await actor.tick(elapsedTime, deltaTime);
        }
        if (this._physicsManager) {
            this._physicsManager.step(deltaTime);
            const collisions = this._physicsManager.getCollisions(this._tickers);

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
        }
        this._draw()
    }

    public addTickable(tickObject: ITickable) {
        if (tickObject && this._tickers.indexOf(tickObject) < 0) {
            this._tickers.push(tickObject);
        }
    }

    public removeTickable(actor: ITickable) {
        if (actor) {
            const actorIndex = this._tickers.indexOf(actor);
            if (actorIndex >= 0) {
                this._tickers.splice(actorIndex, 1);
            }
        }
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

    public async getClosestActor(sourcePos: Vector2d, name: string, zone?: IZone<Vector2d>): Promise<IActor | undefined> {
        let result: IActor | undefined;
        let namedActors = await this.getActorsByName(name);
        let fileredActors: IActor[] = [];
        if (zone) {
            for (const a of namedActors) {
                if (await zone.belongs(await a.getPosition())){
                    fileredActors.push(a);
                }
            }

        } else {
            fileredActors = namedActors;
        }
        let distance: number | undefined;
        for (let a of namedActors) {
            const currDist = await sourcePos.distanceTo(await a.getPosition());
            if (!distance || currDist < distance) {
                distance = currDist;
                result = a;
            }
        }
        return result;
    }

    abstract setCameraTarget(targer: IActor): void;


}


export type Size = {
    height: number;
    width: number;
}