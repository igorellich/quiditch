import { ActiveCollisionTypes, ActiveEvents, ColliderDesc, RigidBody, RigidBodyDesc, World } from "@dimforge/rapier2d";
import { IBody } from "../../../engine/MF/IBody";
import { IQuiditchFactory } from "../../IQuiditchActorFactory";
import { RapierBasedBody } from "../../../engine/MF/rapier/RapierBasedBody";

export class RapierBodyFactory implements IQuiditchFactory<IBody>{
    private readonly _world: World;
    constructor(world: World) {
        this._world = world;
    }
    async createBall(): Promise<IBody> {
        const rigidBody = this._createBallRigidBody();
        const body =  new RapierBasedBody(rigidBody);
        body.tick = async (elapsedTime: number, deltaTime: number)=>{
            // body.getRigidBody().applyImpulse({x:0,y:0.003},true);
        }
       return body;
    }
    async createPlayer(): Promise<IBody> {
        const playerRigidBody = this._createPlayerRigidBody();
        const body = new RapierBasedBody(playerRigidBody);
        
        return body;
    }
    _createPlayerRigidBody(): RigidBody {

        const characterDesc = RigidBodyDesc.dynamic().setLinearDamping(1);
        const rigidBody = this._world.createRigidBody(characterDesc);
        let characterColliderDesc = ColliderDesc.ball(0.4).setMass(1)
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
        let characterColliderDesc = ColliderDesc.ball(0.5).setMass(0.1)
        const collider = this._world.createCollider(
            characterColliderDesc,
            rigidBody,
        );
        //collider.setActiveCollisionTypes(ActiveCollisionTypes.DEFAULT |  ActiveCollisionTypes.KINEMATIC_FIXED );
        collider.setActiveEvents(ActiveEvents.COLLISION_EVENTS)
        return rigidBody;

    }

}