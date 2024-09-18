import { ActiveCollisionTypes, ActiveEvents, ColliderDesc, RigidBody, RigidBodyDesc, World } from "@dimforge/rapier2d";
import { IBody } from "../../../../engine/MB/IBody";
import { IQuiditchFactory } from "../../IQuiditchActorFactory";
import { RapierBasedBody } from "../../../../engine/MB/rapier/RapierBasedBody";
import { createArenaBuffer32Array } from "../../../../tools";

export class RapierBodyFactory implements IQuiditchFactory<IBody>{
    private readonly _world: World;
    constructor(world: World) {
        this._world = world;
    }
    createPointer(): Promise<IBody> {
        return null;
    }
    async createWalls(): Promise<IBody> {
        const groundBodyDesc = RigidBodyDesc.fixed().setCcdEnabled(true);
        const rigidBody = this._world.createRigidBody(groundBodyDesc);

        const polyLine = createArenaBuffer32Array(20, 50);
        const wallColider = this._world.createCollider(ColliderDesc.polyline(polyLine), rigidBody);
        wallColider.setActiveEvents(ActiveEvents.COLLISION_EVENTS);
        
        wallColider.setRestitution(1);
        
        return  new RapierBasedBody(rigidBody, this._world);
    }
    createGround(): Promise<IBody> {
        return null;
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

        const characterDesc = RigidBodyDesc.dynamic().setLinearDamping(10).setAngularDamping(10);
        const rigidBody = this._world.createRigidBody(characterDesc);
        let characterColliderDesc = ColliderDesc.capsule(1.1,0.3).setMass(70)
        const collider = this._world.createCollider(
            characterColliderDesc,
            rigidBody,
        );
        collider.setActiveCollisionTypes(ActiveCollisionTypes.DEFAULT |  ActiveCollisionTypes.KINEMATIC_FIXED | ActiveCollisionTypes.DYNAMIC_KINEMATIC );
        collider.setActiveEvents(ActiveEvents.COLLISION_EVENTS)
        return rigidBody;

    }
    _createBallRigidBody(): RigidBody {

        const characterDesc = RigidBodyDesc.dynamic().setLinearDamping(4).setAngularDamping(0.8).setCcdEnabled(true);;
        const rigidBody = this._world.createRigidBody(characterDesc);
        let characterColliderDesc = ColliderDesc.ball(0.6).setMass(0.1).setRestitution(1).setFriction(0)
        const collider = this._world.createCollider(
            characterColliderDesc,
            rigidBody,
        );
        //collider.setActiveCollisionTypes(ActiveCollisionTypes.DEFAULT |  ActiveCollisionTypes.KINEMATIC_FIXED );
        collider.setActiveEvents(ActiveEvents.COLLISION_EVENTS)
        return rigidBody;

    }

}