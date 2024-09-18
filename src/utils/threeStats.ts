import { ITickable } from "../engine/base/ITickable";
import Stats from 'three/examples/jsm/libs/stats.module'
export class ThreeStats implements ITickable{

    private readonly _stats = new Stats();
    constructor(domNode: HTMLElement){
        domNode.appendChild(this._stats.dom)
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        this._stats.update()
    }
    
}