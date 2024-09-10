import { Actor } from "../../engine/base/Actor";
import { IQuiditchFactory } from "../IQuiditchActorFactory";
import { IBody } from "../../engine/MF/IBody";
import { IMesh } from "../../engine/MF/IMesh";
import { MFActor } from "../../engine/MF/MFActor";
import { CollisionGroups } from "../constants";


export class MFQuiditchFactory implements IQuiditchFactory<Actor>{
    
    private readonly _bodyFactory:IQuiditchFactory<IBody>;
    private readonly _meshFactory: IQuiditchFactory<IMesh>

    constructor(bodyFactory:IQuiditchFactory<IBody>, meshFactory: IQuiditchFactory<IMesh>){
        this._bodyFactory = bodyFactory;
        this._meshFactory = meshFactory;
    }
    async createBall(): Promise<Actor> {
        const body = await this._bodyFactory.createBall();
        const mesh = await this._meshFactory.createBall();
        body.setCollisions([CollisionGroups.ball],[CollisionGroups.character,CollisionGroups.gates,CollisionGroups.wall])
        return new MFActor(body, mesh, 0.2,0.2);
    }
    async createPlayer(): Promise<Actor> {
        const body = await this._bodyFactory.createPlayer();
        body.setCollisions([CollisionGroups.character],[CollisionGroups.ball,CollisionGroups.gates,CollisionGroups.wall])
        const mesh = await this._meshFactory.createPlayer();
        return new MFActor(body, mesh, 0.1,0.1);
    }

   

}