import { RigidBody } from "@dimforge/rapier2d";
import { PhysicsMesh } from "../PhysicsMesh";
import { Mesh } from "three";

export class InstanceStore{
    _instances:PhysicsMesh[] = []
    getIntanceByBody(body: RigidBody):PhysicsMesh|undefined{
        return this._instances.find(i => i.body == body);
    }
    getIntanceByMesh(mesh: Mesh): PhysicsMesh | undefined {
        return this._instances.find(i => i.mesh == mesh);
    }
    add(instance: PhysicsMesh) {
        if (instance && this._instances.indexOf(instance) < 0) {
            this._instances.push(instance)
                ;
        }
    }
    remove(instance: PhysicsMesh) {
        if (instance) {
            const index = this._instances.indexOf(instance);
            if (index >= 0) {
                this._instances.splice(index, 1);
            }
        }
    }
    getInstancesByType(T:typeof PhysicsMesh){
        
        return this._instances.filter(i=>i instanceof T);
    }
}