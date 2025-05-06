import { IActor } from "@common/IActor";
import { ITickable } from "@common/ITickable";

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

    

    abstract setCameraTarget(targer: IActor): void;


}


export type Size = {
    height: number|string;
    width: number|string;
}