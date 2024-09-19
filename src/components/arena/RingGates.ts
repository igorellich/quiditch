import RAPIER, { RigidBody } from "@dimforge/rapier2d";
import { PhysicsMesh, PhysicsMeshArgs } from "../PhysicsMesh";
import {MeshBasicMaterial, Group, TorusGeometry, Mesh, CylinderGeometry} from 'three'

export class RingGates extends PhysicsMesh{
    public update(elapsedTime: number): void {
        super.update(elapsedTime);
       
    }
    private readonly _ringRadius: number;
    constructor(argsObj: PhysicsMeshArgs, radius: number){
        super(argsObj);
        this._ringRadius = radius;
        const material = new MeshBasicMaterial({
            color:'gold'
        });
        this.mesh = new Group();
       
        const ringHeight = -this._ringRadius+this._zHeight;
        const ringGeom = new TorusGeometry(this._ringRadius,0.1*this._ringRadius,12,48);
        // thee js part
        const ringMesh = new Mesh(ringGeom,material);
        ringMesh.position.z = this._ringRadius+ringHeight;
        ringMesh.rotation.x = -Math.PI/2;
        ringMesh.rotation.z = this._rotation;
        const basementGeom = new CylinderGeometry(0.1, 0.1, ringHeight);
        const basementMesh = new Mesh(basementGeom, material);
        basementMesh.position.z=ringHeight/2;
        basementMesh.rotation.x = -Math.PI/2;
        this.mesh.add(ringMesh,basementMesh)
        this.mesh.position.set(this._translation.x,this._translation.y, 0);
        this._scene.add(this.mesh);
        
        //rapier part

        const ringBodyDesc = RAPIER.RigidBodyDesc.fixed().setCcdEnabled(true).setCanSleep(true) 

        const ringBordersDesc = RAPIER.RigidBodyDesc.dynamic().setCcdEnabled(true).setCanSleep(true) 

        const rightBorderBody = this._world.createRigidBody(ringBordersDesc);

      

        rightBorderBody.setTranslation({ x: this._translation.x + this._ringRadius, y: this._translation.y }, true)
        const leftBorderBody = this._world.createRigidBody(ringBordersDesc);
        leftBorderBody.setTranslation({ x: this._translation.x - this._ringRadius, y: this._translation.y }, true)

        this.body = this._world.createRigidBody(ringBodyDesc);
        this.body.setTranslation(this._translation, true);
           

       
        const middleColliderDesc = RAPIER.ColliderDesc.cuboid(this._ringRadius, 0.2).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
        const borderColliderDesc = RAPIER.ColliderDesc.cuboid(0.1, 0.1).setRestitution(1.1);

        const leftcollider = this._world.createCollider(borderColliderDesc, leftBorderBody)
        const rightcollider = this._world.createCollider(borderColliderDesc, rightBorderBody)

        const middleCollider = this._world.createCollider(middleColliderDesc, this.body);
        middleCollider.setCollisionGroups(this._filterGroups)
        middleCollider.setSensor(true);
        let leftJoint = RAPIER.JointData.fixed({ x: 0.0, y: 0.0 }, 0, { x: -this._ringRadius, y: 0.0 },0);
        this._world.createImpulseJoint(leftJoint, leftBorderBody, this.body as RigidBody, false);
         const rightJointParams = RAPIER.JointData.fixed({ x: 0.0, y: 0.0 }, 0, { x: this._ringRadius, y: 0.0 }, 0);
       this._world.createImpulseJoint(rightJointParams, rightBorderBody, this.body as RigidBody, true);
       
       this.body.setRotation(this._rotation, true);
        
    }

    
}