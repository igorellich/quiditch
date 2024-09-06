import { PhysicsMeshArgs } from "../PhysicsMesh";
import { BaseBall } from "./BaseBall";

export class HitBall extends BaseBall{
    constructor(args:PhysicsMeshArgs){
        super(args)
        const impules = { x: -Math.sin(this._rotation) * 5, y: Math.cos(this._rotation) * 5 };
        if (this.body) {
            this.body.applyImpulse(impules, true)
        }
    }
}