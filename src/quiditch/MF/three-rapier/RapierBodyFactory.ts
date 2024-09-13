import { ActiveCollisionTypes, ActiveEvents, ColliderDesc, RigidBody, RigidBodyDesc, World } from "@dimforge/rapier2d";
import { IBody } from "../../../engine/MF/IBody";
import { IQuiditchFactory } from "../../IQuiditchActorFactory";
import { RapierBasedBody } from "../../../engine/MF/rapier/RapierBasedBody";

export class RapierBodyFactory implements IQuiditchFactory<IBody>{
    private readonly _world: World;
    constructor(world: World) {
        this._world = world;
    }
    createPlane(): Promise<IBody> {
        throw new Error("Method not implemented.");
    }
    async createBall(): Promise<IBody> {
        const rigidBody = this._createBallRigidBody();
        const body =  new RapierBasedBody(rigidBody, this._world);
        body.tick = async (elapsedTime: number, deltaTime: number)=>{
            // body.getRigidBody().applyImpulse({x:0,y:0.003},true);
        }
       return body;
    }
    async createPlayer(): Promise<IBody> {
        const playerRigidBody = this._createPlayerRigidBody();
        const body = new RapierBasedBody(playerRigidBody, this._world);
        
        return body;
    }
    _createPlayerRigidBody(): RigidBody {

        const characterDesc = RigidBodyDesc.dynamic().setLinearDamping(1).setAngularDamping(10);;
        const rigidBody = this._world.createRigidBody(characterDesc);
        let characterColliderDesc = ColliderDesc.ball(2).setMass(70)
        const collider = this._world.createCollider(
            characterColliderDesc,
            rigidBody,
        );
        collider.setActiveCollisionTypes(ActiveCollisionTypes.DEFAULT |  ActiveCollisionTypes.KINEMATIC_FIXED | ActiveCollisionTypes.DYNAMIC_KINEMATIC );
        collider.setActiveEvents(ActiveEvents.COLLISION_EVENTS)
        return rigidBody;

    }
    _createBallRigidBody(): RigidBody {

        const characterDesc = RigidBodyDesc.dynamic().setLinearDamping(1).setAngularDamping(1);
        const rigidBody = this._world.createRigidBody(characterDesc);
        let characterColliderDesc = ColliderDesc.ball(2).setMass(1)
        const collider = this._world.createCollider(
            characterColliderDesc,
            rigidBody,
        );
        //collider.setActiveCollisionTypes(ActiveCollisionTypes.DEFAULT |  ActiveCollisionTypes.KINEMATIC_FIXED );
        collider.setActiveEvents(ActiveEvents.COLLISION_EVENTS)
        return rigidBody;

    }

}