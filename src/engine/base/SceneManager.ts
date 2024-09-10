import { Actor } from "./Actor";
import { ICollisionManager } from "./ICollisionManager";
import { ITickable } from "./ITickable";

export abstract class SceneManager{
    private readonly _tickers: ITickable[]=[];
    private _prevTime: number = 0;
    protected _size: Size;
    private readonly _collisionManager?:ICollisionManager;
    constructor(size:Size, collisionManager?:ICollisionManager){
      
        this._size = size;
        this._collisionManager  =collisionManager;

    }
    public abstract startTime():void;
    public abstract stopTime():void;
    protected abstract _getElapsedTime():number;
    protected abstract _draw(): void;
    protected tick() {
        const elapsedTime = this._getElapsedTime();
        const deltaTime = elapsedTime - (this._prevTime);
        this._prevTime = elapsedTime;
        for (const actor of this._tickers) {
            actor.tick(elapsedTime, deltaTime);
        }
        if(this._collisionManager){
            this._collisionManager.step(deltaTime);
            const collisions = this._collisionManager.getCollisions(this._tickers);
            if(collisions.length>0){
                console.log(collisions);
            }
        }
        this._draw()
    }

    public addTickable(tickObject: ITickable) {
        if (tickObject && this._tickers.indexOf(tickObject) < 0) {
            this._tickers.push(tickObject);
        }
    }

    public removeTickable(actor: Actor) {
        if (actor) {
            const actorIndex = this._tickers.indexOf(actor);
            if (actorIndex >= 0) {
                this._tickers.splice(actorIndex, 1);
            }
        }
    }
}


export type Size={
    height: number;
    width: number;
}