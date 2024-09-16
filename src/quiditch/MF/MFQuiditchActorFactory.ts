import { Actor } from "../../engine/base/Actor/Actor";
import { IQuiditchFactory } from "../IQuiditchActorFactory";
import { IBody } from "../../engine/base/IBody";
import { IMesh } from "../../engine/MF/IMesh";
import { MFActor } from "../../engine/MF/MFActor";
import { CollisionGroups } from "../constants";
import { IActor } from "../../engine/base/Actor/IActor";
import { PlayerActor } from "../components/PlayerActor";
import { BodyActorDecorator } from "../../engine/base/Actor/BodyActorDecorator";
import { SceneManager } from "../../engine/base/SceneManager";
import { MeshBasedActor } from "../../engine/MF/three/MeshBasedActor";


export class MFQuiditchFactory implements IQuiditchFactory<IActor> {

    private readonly _bodyFactory: IQuiditchFactory<IBody>;
    private readonly _meshFactory: IQuiditchFactory<IMesh>
    private readonly _sceneManager: SceneManager

   

    constructor(bodyFactory: IQuiditchFactory<IBody>, meshFactory: IQuiditchFactory<IMesh>, sceneManager: SceneManager) {
        this._bodyFactory = bodyFactory;
        this._meshFactory = meshFactory;
        this._sceneManager = sceneManager;
    }
    async createWalls(): Promise<IActor> {
        const body = await this._bodyFactory.createWalls();
        const mesh = await this._meshFactory.createWalls();
        body.setCollisions([CollisionGroups.wall], [CollisionGroups.character, CollisionGroups.ball])
        const baseActor = new MFActor(body, mesh, 0, 0,"MF_wall");
        return new BodyActorDecorator(baseActor, "wall", this._sceneManager);
    }
    async createGround(): Promise<IActor> {
        const mesh = await this._meshFactory.createGround();
        return new MeshBasedActor(mesh);
    }
    async createBall(): Promise<BodyActorDecorator> {
        const body = await this._bodyFactory.createBall();
        const mesh = await this._meshFactory.createBall();
        body.setCollisions([CollisionGroups.ball], [CollisionGroups.character, CollisionGroups.gates, CollisionGroups.wall])
        const baseActor = new MFActor(body, mesh, 10, 10, "MF_ball");
        return new BodyActorDecorator(baseActor, "ball", this._sceneManager);
    }
    async createPlayer(): Promise<PlayerActor> {
        const body = await this._bodyFactory.createPlayer();
        body.setCollisions([CollisionGroups.character], [CollisionGroups.ball, CollisionGroups.gates, CollisionGroups.wall])
        const mesh = await this._meshFactory.createPlayer();
        const baseActor = new MFActor(body, mesh, 0.1, 0.1,"MF_player");
        return new PlayerActor(baseActor,"player", this._sceneManager);
    }



}