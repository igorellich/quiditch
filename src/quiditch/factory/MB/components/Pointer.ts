import { IMesh } from "../../../../engine/MB/IMesh";
import { MeshBasedActor } from "../../../../engine/MB/three/MeshBasedActor";
import { IActor } from "../../../../engine/base/Actor/IActor";
import { Collision } from "../../../../engine/base/Collision";
import { IObject2D } from "../../../../engine/base/IObject2D";

export class Pointer extends MeshBasedActor{
    async onCollision(collision: Collision): Promise<void> {
        
    }
    private _targetObject?: IObject2D;

    private _sourceActor?: IActor;
    constructor(name: string, mesh:IMesh, targetObject?: IObject2D, sourceActor?:IActor){
        super(name, mesh);
        this._targetObject = targetObject;
        this._sourceActor = sourceActor;
    }

    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
       await super.tick(elapsedTime, deltaTime);
       if(this._sourceActor){
            const pos = await this._sourceActor.getPosition();
            await this.setPosition(pos.x, pos.y);
            if(this._targetObject){
                const targetPos = await this._targetObject.getPosition();
                const angle = await this.getAngelToTarget(targetPos);// radians
                const currentRotation = await (this.getRotation());
                const resultAngle = (currentRotation+angle)%(2*Math.PI);
                
                await this.setRotation(resultAngle);
           }
       }
     
    }
}