import { IQuiditchFactory } from "../IQuiditchActorFactory";
import { IBody } from "../../../engine/MB/IBody";
import { IMesh } from "../../../engine/MB/IMesh";
import { BodyActor } from "../../../engine/MB/BodyActor";
import { ActorNames, CollisionGroups } from "../../constants";
import { IActor } from "../../../engine/base/Actor/IActor";
import { PlayerActor } from "./components/PlayerActor";
import { BodyActorDecorator } from "../../../engine/MB/Actor/BodyActorDecorator";
import { SceneManager } from "../../../engine/base/SceneManager";
import { MeshBasedActor } from "../../../engine/MB/three/MeshBasedActor";
import { IObject2D } from "../../../engine/base/IObject2D";
import { Pointer } from "./components/Pointer";
import { Gates } from "./components/Gates";
import { Quaffle } from "./components/balls/Quaffle";


export class QuiditchFactory implements IQuiditchFactory<IActor> {

    private readonly _bodyFactory: IQuiditchFactory<IBody>;
    private readonly _meshFactory: IQuiditchFactory<IMesh>
    private readonly _sceneManager: SceneManager

   

    constructor(bodyFactory: IQuiditchFactory<IBody>, meshFactory: IQuiditchFactory<IMesh>, sceneManager: SceneManager) {
        this._bodyFactory = bodyFactory;
        this._meshFactory = meshFactory;
        this._sceneManager = sceneManager;
    }
    async createGates(radius: number): Promise<Gates> {
        //const mesh = await this._meshFactory.createGates(radius);
        const body = await this._bodyFactory.createGates(radius);
        await body.setCollisions([CollisionGroups.gates], [CollisionGroups.character, CollisionGroups.ball])
        const id = Math.random().toString();
        const baseActor = new BodyActor(body, 0, 0,"gates",id);
        return new Gates(baseActor, this._sceneManager);
       
    }
     async createPointer(targetObject?: IObject2D, sourceActor?:IActor): Promise<Pointer> {
        const mesh = await this._meshFactory.createPointer(targetObject, sourceActor) as Pointer;
        const id = Math.random().toString();
        return new Pointer("pointer",mesh, id,targetObject,sourceActor);
       
    }
    async createWalls(): Promise<IActor> {
        const body = await this._bodyFactory.createWalls();
        //const mesh = await this._meshFactory.createWalls();
        body.setCollisions([CollisionGroups.wall], [CollisionGroups.character, CollisionGroups.ball])
        const id = Math.random().toString();
        const baseActor = new BodyActor(body, 0, 0,"wall",id);
        return new BodyActorDecorator(baseActor, this._sceneManager);
    }
    async createGround(): Promise<IActor> {
        const mesh = await this._meshFactory.createGround();
        const id = Math.random().toString();
        return new MeshBasedActor("ground", mesh,id);
    }
    async createQuaffle(): Promise<BodyActorDecorator> {
        const body = await this._bodyFactory.createQuaffle();
        //const mesh = await this._meshFactory.createQuaffle();
        body.setCollisions([CollisionGroups.ball], [CollisionGroups.character, CollisionGroups.gates, CollisionGroups.wall])
        const id = Math.random().toString();
        const baseActor = new BodyActor(body, 3, 3, ActorNames.quaffle,id);
        const ball = new Quaffle(baseActor, this._sceneManager);
       
        return ball;

    }
    async createPlayer(color?:string): Promise<PlayerActor> {
        const body = await this._bodyFactory.createPlayer();
        body.setCollisions([CollisionGroups.character], [CollisionGroups.character, CollisionGroups.ball, CollisionGroups.gates, CollisionGroups.wall])
        //const mesh = await this._meshFactory.createPlayer(color);
        const id = Math.random().toString();
        const baseActor = new BodyActor(body, 0.15, 0.25,"player",id);
        return new PlayerActor(baseActor, this._sceneManager,color);
    }



}