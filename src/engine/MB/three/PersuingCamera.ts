import { PerspectiveCamera } from "three";
import { ITickable } from "../../base/ITickable";
import { ThreeBasedMesh } from "./ThreeBasedMesh";
import { IActor } from "../../base/Actor/IActor";

export class PersuingCamera extends ThreeBasedMesh implements ITickable {

    
    constructor(camera: PerspectiveCamera, yDistance: number = 0) {
        super(camera);
        this._yDistance = yDistance;
    }
    private _target?: IActor;
    private readonly _yDistance: number = 0;
    async setTarget(target: IActor) {
        this._target = target;
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        if (this._target) {
            const pos = await this._target.getPosition();
            
            this._mesh.position.set(pos.x, pos.y - this._yDistance, this._mesh.position.z);
            (this._mesh as PerspectiveCamera).lookAt(pos.x, pos.y, 2);
        }
    }

}