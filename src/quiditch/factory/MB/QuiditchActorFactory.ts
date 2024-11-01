import { IQuiditchFactory } from "../IQuiditchActorFactory";
import { IBody } from "../../../engine/MB/IBody";
import { IMesh } from "../../../engine/MB/IMesh";
import { BodyActor } from "../../../engine/MB/BodyActor";
import { ActorNames, CollisionGroups } from "../../constants";
import { IActor } from "../../../engine/base/Actor/IActor";
import { PlayerActor } from "./components/PlayerActor";
import { BodyActorDecorator } from "../../../engine/MB/Actor/BodyActorDecorator";
import { SceneManager } from "../../../engine/base/SceneManager";
import { IObject2D } from "../../../engine/base/IObject2D";
import { Pointer } from "./components/Pointer";
import { Gates } from "./components/Gates";
import { Quaffle } from "./components/balls/Quaffle";
import { IPhysicsManager } from "../../../engine/base/IPhysicsManager";


export class QuiditchFactory implements IQuiditchFactory<IActor> {

    private readonly _bodyFactory: IQuiditchFactory<IBody>;

    private readonly _physicsManager: IPhysicsManager;
   

    constructor(bodyFactory: IQuiditchFactory<IBody>, physicsManager: IPhysicsManager) {
        this._bodyFactory = bodyFactory;        
        this._physicsManager = physicsManager;
    }
    async createGates(radius: number): Promise<Gates> {
        //const mesh = await this._meshFactory.createGates(radius);
        const body = await this._bodyFactory.createGates(radius);
        await body.setCollisions([CollisionGroups.gates], [CollisionGroups.character, CollisionGroups.ball])
        const id = Math.random().toString();
        const baseActor = new BodyActor(body, 0, 0,ActorNames.gates,id);
        return new Gates(baseActor, this._physicsManager);
       
    }
     async createPointer(targetObject?: IObject2D, sourceActor?:IActor): Promise<Pointer|undefined> {
       return undefined;
       
    }
    async createWalls(): Promise<IActor> {
        const body = await this._bodyFactory.createWalls();
        
        body.setCollisions([CollisionGroups.wall], [CollisionGroups.character, CollisionGroups.ball])
        const id = Math.random().toString();
        const baseActor = new BodyActor(body, 0, 0,ActorNames.walls,id);
        return new BodyActorDecorator(baseActor, this._physicsManager);
    }
    async createGround(): Promise<IActor|undefined> {        
        return undefined;
    }
    async createQuaffle(): Promise<BodyActorDecorator> {
        const body = await this._bodyFactory.createQuaffle();
        
        body.setCollisions([CollisionGroups.ball], [CollisionGroups.character, CollisionGroups.gates, CollisionGroups.wall])
        const id = Math.random().toString();
        const baseActor = new BodyActor(body, 3, 3, ActorNames.quaffle,id);
        const ball = new Quaffle(baseActor, this._physicsManager);
       
        return ball;

    }
    async createPlayer(color?:string): Promise<PlayerActor> {
        const body = await this._bodyFactory.createPlayer();
        body.setCollisions([CollisionGroups.character], [CollisionGroups.character, CollisionGroups.ball, CollisionGroups.gates, CollisionGroups.wall])
        
        const id = Math.random().toString();
        const baseActor = new BodyActor(body, 0.15, 0.25,ActorNames.player,id);
        return new PlayerActor(baseActor, this._physicsManager,color);
    }



}