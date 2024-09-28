import { ActiveCollisionTypes, ActiveEvents, ColliderDesc, JointData, RigidBody, RigidBodyDesc, World } from "@dimforge/rapier2d";
import { IBody } from "../../../../engine/MB/IBody";
import { IQuiditchFactory } from "../../IQuiditchActorFactory";
import { RapierBasedBody } from "../../../../engine/MB/rapier/RapierBasedBody";
import { createArenaBuffer32Array, createCircleBuffer32Array } from "../../../../tools";
import { IActor } from "../../../../engine/base/Actor/IActor";
import { IObject2D } from "../../../../engine/base/IObject2D";

export class RapierBodyFactory implements IQuiditchFactory<IBody>{
    private readonly _world: World;
    constructor(world: World) {
        this._world = world;
    }
    createGround(): Promise<IBody> {
        throw new Error("Method not implemented.");
    }
    createPointer(targetObject?: IObject2D | undefined, sourceActor?: IActor | undefined): Promise<IBody> {
        throw new Error("Method not implemented.");
    }
    async createGates(ringRadius:number): Promise<IBody> {


        const ringBodyDesc = RigidBodyDesc.fixed().setCcdEnabled(true)
        const body = this._world.createRigidBody(ringBodyDesc);
        const result = new RapierBasedBody(body, this._world);
        const ringBordersDesc = RigidBodyDesc.dynamic().setCcdEnabled(true)

        const rightBorderBody = this._world.createRigidBody(ringBordersDesc);

      

        rightBorderBody.setTranslation({ x: ringRadius, y: 0 }, true)
        const leftBorderBody = this._world.createRigidBody(ringBordersDesc);
        leftBorderBody.setTranslation({ x: -ringRadius, y: 0 }, true)

        
       
        const middleColliderDesc = ColliderDesc.cuboid(ringRadius, 0.001).setActiveEvents(ActiveEvents.COLLISION_EVENTS);
        const borderColliderDesc = ColliderDesc.cuboid(0.1, 0.4).setRestitution(1.1);

        const leftcollider = this._world.createCollider(borderColliderDesc, leftBorderBody)
        const rightcollider = this._world.createCollider(borderColliderDesc, rightBorderBody)

        const middleCollider = this._world.createCollider(middleColliderDesc, body);
        //middleCollider.setCollisionGroups(this._filterGroups)
        middleCollider.setSensor(true);
        let leftJoint = JointData.fixed({ x: 0.0, y: 0.0 }, 0, { x: -ringRadius, y: 0.0 },0);
        this._world.createImpulseJoint(leftJoint, leftBorderBody, body as RigidBody, false);
         const rightJointParams = JointData.fixed({ x: 0.0, y: 0.0 }, 0, { x: ringRadius, y: 0.0 }, 0);
       this._world.createImpulseJoint(rightJointParams, rightBorderBody, body as RigidBody, true);
       return result;
    }
   
    async createWalls(): Promise<IBody> {
        const groundBodyDesc = RigidBodyDesc.fixed().setCcdEnabled(true);
        const rigidBody = this._world.createRigidBody(groundBodyDesc);

        //const polyLine = createArenaBuffer32Array(20, 50);
        const polyLine1 = createCircleBuffer32Array(70)
        const polyLine2 = createCircleBuffer32Array(70.1)
        const wallColider1 = this._world.createCollider(ColliderDesc.polyline(polyLine1.verticies), rigidBody);
        wallColider1.setActiveEvents(ActiveEvents.COLLISION_EVENTS);
        
        wallColider1.setRestitution(1);

        const wallColider2 = this._world.createCollider(ColliderDesc.polyline(polyLine2.verticies), rigidBody);
        wallColider2.setActiveEvents(ActiveEvents.COLLISION_EVENTS);
        
        wallColider2.setRestitution(1);
        
        return  new RapierBasedBody(rigidBody, this._world);
    }
    
    async createQuaffle(): Promise<IBody> {
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

        const characterDesc = RigidBodyDesc.dynamic().setLinearDamping(1).setAngularDamping(0.8).setCcdEnabled(true);;
        const rigidBody = this._world.createRigidBody(characterDesc);
        let characterColliderDesc = ColliderDesc.ball(0.6).setMass(0.1).setRestitution(1).setFriction(0)
        
        const collider = this._world.createCollider(
            characterColliderDesc,
            rigidBody,
        );
        collider.setActiveEvents(ActiveEvents.COLLISION_EVENTS)

        const ballSensorDesc = ColliderDesc.ball(2).setSensor(true).setMass(0);
        const sensorCollider = this._world.createCollider(
            ballSensorDesc,
            rigidBody,
        );
        sensorCollider.setActiveEvents(ActiveEvents.COLLISION_EVENTS);
        //collider.setActiveCollisionTypes(ActiveCollisionTypes.DEFAULT |  ActiveCollisionTypes.KINEMATIC_FIXED );
        
        return rigidBody;

    }

}