import { Collision } from "@common/Collision";
import { IActor } from "@common/IActor";
import { IObject2D } from "@common/IObject2D";
import { IMesh } from "../../../engine/client/IMesh";
import { MeshBasedActor } from "../../../engine/client/MeshBasedActor";


export class Pointer extends MeshBasedActor{
    async onCollision(collision: Collision): Promise<void> {
        
    }
    private _targetObject?: IObject2D;

    private _sourceActor?: IActor;
    constructor(name: string, mesh:IMesh, id:string, targetObject?: IObject2D, sourceActor?:IActor){
        super(name, mesh, id);
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