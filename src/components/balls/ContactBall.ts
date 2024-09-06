import { Vector2 } from "@dimforge/rapier2d";
import { PhysicsMeshArgs } from "../PhysicsMesh";
import { BaseBall } from "./BaseBall";

export class ContactBall extends BaseBall {
    constructor(args: PhysicsMeshArgs) {
        super(args);

    }
    public update(elapsedTime:number): void {
        super.update(elapsedTime);
        // this.body?.setTranslation(new Vector2(Math.random()*10,Math.random()*2), true)
    }

}