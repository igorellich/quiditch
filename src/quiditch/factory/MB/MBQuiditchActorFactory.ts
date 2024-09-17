import { IQuiditchFactory } from "../IQuiditchActorFactory";
import { IBody } from "../../../engine/MB/IBody";
import { IMesh } from "../../../engine/MB/IMesh";
import { MBActor } from "../../../engine/MB/MBActor";
import { CollisionGroups } from "../../constants";
import { IActor } from "../../../engine/base/Actor/IActor";
import { PlayerActor } from "./components/PlayerActor";
import { BodyActorDecorator } from "../../../engine/MB/Actor/BodyActorDecorator";
import { SceneManager } from "../../../engine/base/SceneManager";
import { MeshBasedActor } from "../../../engine/MB/three/MeshBasedActor";


export class MBQuiditchFactory implements IQuiditchFactory<IActor> {

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
        const baseActor = new MBActor(body, mesh, 0, 0,"MF_wall");
        return new BodyActorDecorator(baseActor, "wall", this._sceneManager);
    }
    async createGround(): Promise<IActor> {
        const mesh = await this._meshFactory.createGround();
        return new MeshBasedActor("ground", mesh);
    }
    async createBall(): Promise<BodyActorDecorator> {
        const body = await this._bodyFactory.createBall();
        const mesh = await this._meshFactory.createBall();
        body.setCollisions([CollisionGroups.ball], [CollisionGroups.character, CollisionGroups.gates, CollisionGroups.wall])
        const baseActor = new MBActor(body, mesh, 10, 10, "MF_ball");
        return new BodyActorDecorator(baseActor, "ball", this._sceneManager);
    }
    async createPlayer(): Promise<PlayerActor> {
        const body = await this._bodyFactory.createPlayer();
        body.setCollisions([CollisionGroups.character], [CollisionGroups.ball, CollisionGroups.gates, CollisionGroups.wall])
        const mesh = await this._meshFactory.createPlayer();
        const baseActor = new MBActor(body, mesh, 0.1, 0.1,"MF_player");
        return new PlayerActor(baseActor,"player", this._sceneManager);
    }



}