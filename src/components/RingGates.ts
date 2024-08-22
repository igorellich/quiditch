import { World } from "@dimforge/rapier2d";
import { PhysicsMesh, Vector } from "./PhysicsMesh";
import {MeshBasicMaterial, Group, TorusGeometry, Mesh, CylinderGeometry, Scene} from 'three'
export class RingGates extends PhysicsMesh{
    private readonly _ringRadius: number;
    constructor(scene: Scene, world: World, zHeight: number =1, translation:Vector= {x:0, y:0, z:0}, rotation: Vector= {x:0, y:0, z:0}, radius: number){
        super(scene,world,zHeight,translation,rotation);
        this._ringRadius = radius;
        
    }
    protected _build(): void {
        const material = new MeshBasicMaterial({
            color:'gold'
        });
        const gates = new Group();
       
        const ringHeight = -this._ringRadius+this._zHeight;
        const ringGeom = new TorusGeometry(this._ringRadius,0.1*this._zHeight,12,48);
        //TODO add debug UI
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
        
    }
    
}