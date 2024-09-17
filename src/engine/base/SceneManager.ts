import { Actor } from "./Actor/Actor";
import { IActor } from "./Actor/IActor";
import { IBodiedActor } from "./Actor/IBodiedActor";
import { IPhysicsManager, RayCastResult } from "./IPhysicsManager";
import { ITickable } from "./ITickable";
import { Vector2d } from "./Vector2d";

export abstract class SceneManager{
    private readonly _tickers: ITickable[]=[];
    private _prevTime: number = 0;
    protected _size: Size;
    protected readonly _collisionManager?:IPhysicsManager;
    constructor(size:Size, collisionManager?:IPhysicsManager){
      
        this._size = size;
        this._collisionManager = collisionManager;

    }
    public abstract startTime():void;
    public abstract stopTime():void;
    protected abstract _getElapsedTime():number;
    protected abstract _draw(): void;
    public async castRay(origin: Vector2d, dir:Vector2d, rayLength: number, sourceActor?: IBodiedActor): Promise<RayCastResult>{
        if(this._collisionManager){
           return this._collisionManager.castRay(origin, dir, rayLength, sourceActor, this.getActors() as IBodiedActor[]);
        }
        return null;
    }



    protected async tick() {
        const elapsedTime = this._getElapsedTime();
        const deltaTime = elapsedTime - (this._prevTime);
        this._prevTime = elapsedTime;
        for (const actor of this._tickers) {
            await actor.tick(elapsedTime, deltaTime);
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

    public removeTickable(actor: ITickable) {
        if (actor) {
            const actorIndex = this._tickers.indexOf(actor);
            if (actorIndex >= 0) {
                this._tickers.splice(actorIndex, 1);
            }
        }
    }

    public getActors():IActor[]{
        return this._tickers.filter(t=>{
            return (t as Actor).move;
        }) as IActor[];
    }

    abstract setCameraTarget(targer:IActor);
    

}


export type Size={
    height: number;
    width: number;
}