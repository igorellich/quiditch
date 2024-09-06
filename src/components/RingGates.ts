import RAPIER from "@dimforge/rapier2d";
import { PhysicsMesh, PhysicsMeshArgs } from "./PhysicsMesh";
import {MeshBasicMaterial, Group, TorusGeometry, Mesh, CylinderGeometry, Scene} from 'three'

export class RingGates extends PhysicsMesh{
    public update(): void {
        
    }
    private readonly _ringRadius: number;
    constructor(argsObj: PhysicsMeshArgs, radius: number){
        super(argsObj);
        this._ringRadius = radius;
        const material = new MeshBasicMaterial({
            color:'gold'
        });
        const gates = new Group();
       
        const ringHeight = -this._ringRadius+this._zHeight;
        const ringGeom = new TorusGeometry(this._ringRadius,0.1*this._ringRadius,12,48);
        // thee js part
        const ringMesh = new Mesh(ringGeom,material);
        ringMesh.position.z = this._ringRadius+ringHeight;
        ringMesh.rotation.x = -Math.PI/2;
        const basementGeom = new CylinderGeometry(0.1, 0.1, ringHeight);
        const basementMesh = new Mesh(basementGeom, material);
        basementMesh.position.z=ringHeight/2;
        basementMesh.rotation.x = -Math.PI/2;
        gates.add(ringMesh,basementMesh)
        gates.position.set(this._translation.x,this._translation.y, this._translation.z);
        this._scene.add(gates);
        this.mesh = gates;
        //rapier part

        const ringBodyDesc = RAPIER.RigidBodyDesc.fixed().setCcdEnabled(true).setCanSleep(false) 

        const rightBorderBody = this._world.createRigidBody(ringBodyDesc);
        rightBorderBody.setTranslation({x:this._translation.x+this._ringRadius, y:this._translation.y}, true) 
        const leftBorderBody = this._world.createRigidBody(ringBodyDesc);
        leftBorderBody.setTranslation({x:this._translation.x - this._ringRadius, y:this._translation.y}, true) 

        const middleBody = this._world.createRigidBody(ringBodyDesc);
        middleBody.setTranslation(this._translation, true);
        this.body = middleBody;
        const middleColliderDesc = RAPIER.ColliderDesc.cuboid(this._ringRadius, 0.2).setActiveEvents(RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS); 
        const borderColliderDesc = RAPIER.ColliderDesc.cuboid(0.1, 0.1).setRestitution(1.1);

        const leftcollider = this._world.createCollider(borderColliderDesc, leftBorderBody)
        const rightcollider = this._world.createCollider(borderColliderDesc, rightBorderBody)
        
        const middleCollider = this._world.createCollider(middleColliderDesc, middleBody);
        middleCollider.setCollisionGroups(this._filterGroups)
        middleCollider.setSensor(true);
    }

    
}