import { IZone } from "../ai/zone/IZone";
import { IActor } from "./Actor/IActor";
import { IPhysicsManager, RayCastResult } from "./IPhysicsManager";
import { ITickable } from "./ITickable";
import { Vector2d } from "./Vector2d";

export abstract class SceneManager {
    private readonly _tickers: ITickable[] = [];
    protected _prevTime: number = 0;
    protected _size: Size;  
    constructor(size: Size) {

        this._size = size;
        

    }
    public abstract startTime(): void;
    public abstract stopTime(): void;
    protected abstract _getElapsedTime(): number;
    protected abstract _draw(): void;
   


    protected async tick() {
        // console.log("scene manager tick");
        const elapsedTime = this._getElapsedTime();
        const deltaTime =  elapsedTime - (this._prevTime);
        this._prevTime = elapsedTime;
        for (const actor of this._tickers) {
            await actor.tick(elapsedTime, deltaTime);
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

    public async getClosestActor(sourcePos: Vector2d, targetActors: IActor[], zone?: IZone<Vector2d>): Promise<IActor | undefined> {
        let result: IActor | undefined;
        
        let fileredActors: IActor[] = [];
        if (zone) {
            for (const a of targetActors) {
                if (await zone.belongs(await a.getPosition())){
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

    public getTickers():ITickable[]{
        return [...this._tickers];
    }

    abstract setCameraTarget(targer: IActor): void;


}


export type Size = {
    height: number;
    width: number;
}