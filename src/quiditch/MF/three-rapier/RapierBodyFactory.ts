import { RigidBody, RigidBodyDesc, World } from "@dimforge/rapier2d";
import { IBody } from "../../../engine/MF/IBody";
import { IQuiditchFactory } from "../../IQuiditchActorFactory";
import { RapierBasedBody } from "./RapierBasedBody";

export class RapierBodyFactory implements IQuiditchFactory<IBody>{
    private readonly _world:World;
    constructor(world: World){
        this._world  =world;
    }
    async createPlayer(): Promise<IBody> {
        const playerRigidBody = this._createPlayerRigidBody();
        return new RapierBasedBody(playerRigidBody);
    }
    _createPlayerRigidBody():RigidBody{
       
        const characterDesc =  RigidBodyDesc.kinematicPositionBased();
        return this._world.createRigidBody(characterDesc);
       
    }

}