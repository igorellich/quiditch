import * as THREE from 'three'
import { PhysicsMesh, PhysicsMeshArgs } from "../PhysicsMesh";
import RAPIER, { ActiveCollisionTypes, ImpulseJoint, RigidBody } from '@dimforge/rapier2d';

export class BaseBall extends PhysicsMesh {

    private _joint: ImpulseJoint|undefined;
    constructor(argsObj: PhysicsMeshArgs) {
        super(argsObj);
        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({
            color: "purple"
        }));
        this.mesh.position.z = this._zHeight;
        this._scene.add(this.mesh)
        // Create the body
        let ballBodyDesc = RAPIER.RigidBodyDesc.dynamic().setLinearDamping(0.1).setCcdEnabled(true);

        const spawnPos: RAPIER.Vector2 = { x: this._translation.x - Math.sin(this._rotation) * 2, y: this._translation.y + Math.cos(this._rotation) * 2 }

        this.body = this._world.createRigidBody(ballBodyDesc)
        this.body.setTranslation(spawnPos, true)

        const ballColliderDesc = RAPIER.ColliderDesc.ball(0.1).setMass(0.2).setRestitution(0.7);
        const collider = this._world.createCollider(ballColliderDesc, this.body);
        collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);  
        //collider.setActiveCollisionTypes(ActiveCollisionTypes.DEFAULT|ActiveCollisionTypes.DYNAMIC_FIXED)
        collider.setCollisionGroups(this._filterGroups)
    }
    join(jointBody: RigidBody): boolean {

        this.unJoin()

        //joint
        let params = RAPIER.JointData.revolute({ x: 0.8, y: 0.0 }, { x: 0.1, y: 0.0 });
        this._joint = this._world.createImpulseJoint(params, jointBody, this.body as RigidBody, true);
        (this._joint as RAPIER.RevoluteImpulseJoint).configureMotorVelocity(5.0, 0.0);
        return true;
    }
    getJoin():ImpulseJoint|undefined{
        return this._joint;
    } 

    unJoin():boolean{
        if(this._joint){
            this._world.removeImpulseJoint(this._joint, true);
            this._joint= undefined;
        }
        return true;
    }


}