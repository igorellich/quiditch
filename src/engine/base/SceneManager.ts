import { Actor } from "./Actor";
import { ICollisionManager } from "./ICollisionManager";

export abstract class SceneManager{
    private readonly _actors: Actor[]=[];
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
    protected updateActors() {
        const elapsedTime = this._getElapsedTime();
        const deltaTime = elapsedTime - (this._prevTime);
        this._prevTime = elapsedTime;
        for (const actor of this._actors) {
            actor.update(elapsedTime, deltaTime);
        }
        if(this._collisionManager){
            this._collisionManager.step(deltaTime);
            const collisions = this._collisionManager.getCollisions(this._actors);
        }
        this._draw()
    }

    public addActor(actor: Actor) {
        if (actor && this._actors.indexOf(actor) < 0) {
            this._actors.push(actor);
        }
    }

    public removeActor(actor: Actor) {
        if (actor) {
            const actorIndex = this._actors.indexOf(actor);
            if (actorIndex >= 0) {
                this._actors.splice(actorIndex, 1);
            }
        }
    }
}


export type Size={
    height: number;
    width: number;
}