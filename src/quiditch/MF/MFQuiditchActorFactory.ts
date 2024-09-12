import { Actor } from "../../engine/base/Actor";
import { IQuiditchFactory } from "../IQuiditchActorFactory";
import { IBody } from "../../engine/MF/IBody";
import { IMesh } from "../../engine/MF/IMesh";
import { MFActor } from "../../engine/MF/MFActor";
import { CollisionGroups } from "../constants";
import { IActor } from "../../engine/base/IActor";
import { PlayerActor } from "../components/PlayerActor";
import { BodyActorDecorator } from "../../engine/MF/BodyActorDecorator";


export class MFQuiditchFactory implements IQuiditchFactory<IActor>{
    
    private readonly _bodyFactory:IQuiditchFactory<IBody>;
    private readonly _meshFactory: IQuiditchFactory<IMesh>

    constructor(bodyFactory:IQuiditchFactory<IBody>, meshFactory: IQuiditchFactory<IMesh>){
        this._bodyFactory = bodyFactory;
        this._meshFactory = meshFactory;
    }
    async createBall(): Promise<BodyActorDecorator> {
        const body = await this._bodyFactory.createBall();
        const mesh = await this._meshFactory.createBall();
        body.setCollisions([CollisionGroups.ball],[CollisionGroups.character,CollisionGroups.gates,CollisionGroups.wall])
        const baseActor = new MFActor(body, mesh, 0.2,0.2);
        return new BodyActorDecorator(baseActor);
    }
    async createPlayer(): Promise<PlayerActor> {
        const body = await this._bodyFactory.createPlayer();
        body.setCollisions([CollisionGroups.character],[CollisionGroups.ball,CollisionGroups.gates,CollisionGroups.wall])
        const mesh = await this._meshFactory.createPlayer();
        const baseActor = new MFActor(body, mesh, 0.1,0.1);
        return new PlayerActor(baseActor);
    }

   

}