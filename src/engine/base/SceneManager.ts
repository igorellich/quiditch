import { IActor } from "./Actor/IActor";
import { IPhysicsManager, RayCastResult } from "./IPhysicsManager";
import { ITickable } from "./ITickable";
import { Vector2d } from "./Vector2d";

export abstract class SceneManager{
    private readonly _tickers: ITickable[]=[];
    private _prevTime: number = 0;
    protected _size: Size;
    protected readonly _physicsManager?:IPhysicsManager;
    constructor(size:Size, physicsManager?:IPhysicsManager){
      
        this._size = size;
        this._physicsManager = physicsManager;

    }
    public abstract startTime():void;
    public abstract stopTime():void;
    protected abstract _getElapsedTime():number;
    protected abstract _draw(): void;
    public async castRay(origin: Vector2d, dir:Vector2d, rayLength: number, sourceActor?: IActor): Promise<RayCastResult>{
        if(this._physicsManager){
           return this._physicsManager.castRay(origin, dir, rayLength, sourceActor, this.getActors() as IActor[]);
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
        if(this._physicsManager){
            this._physicsManager.step(deltaTime);
            const collisions = this._physicsManager.getCollisions(this._tickers);
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
            return (t as IActor).move;
        }) as IActor[];
    }

    abstract setCameraTarget(targer:IActor);
    

}


export type Size={
    height: number;
    width: number;
}