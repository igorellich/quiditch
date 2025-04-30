
import { Gates } from "./components/Gates";
import { Quaffle } from "./components/balls/Quaffle";
import { IQuiditchFactory } from "../../common/IQuiditchActorFactory";
import { IBody } from "../../../engine/server/base/IBody";
import { IPhysicsManager } from "../../../engine/server/base/IPhysicsManager";

import { BodyActorDecorator } from "../../../engine/server/base/Actor/BodyActorDecorator";
import { PlayerActor } from "./components/PlayerActor";
import { IActor } from "@common/IActor";
import { ActorNames, CollisionGroups } from "../../common/constants";
import { BodyActor } from "../../../engine/server/base/BodyActor";



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
        const baseActor = new BodyActor(body, 1, 1, ActorNames.quaffle,id);
        const ball = new Quaffle(baseActor, this._physicsManager);
       
        return ball;

    }
    async createPlayer(color?:string): Promise<PlayerActor> {
        const body = await this._bodyFactory.createPlayer();
        body.setCollisions([CollisionGroups.character], [CollisionGroups.character, CollisionGroups.ball, CollisionGroups.gates, CollisionGroups.wall])
        
        const id = Math.random().toString();
        const baseActor = new BodyActor(body, 0.02, 0.05,ActorNames.player,id);
        return new PlayerActor(baseActor, this._physicsManager,color);
    }



}