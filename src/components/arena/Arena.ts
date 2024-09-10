import RAPIER, { ActiveCollisionTypes } from "@dimforge/rapier2d";

import { createArenaBuffer32Array } from "../../tools";
import { PhysicsMesh, PhysicsMeshArgs } from "../PhysicsMesh";
import { AmbientLight, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { CollisionGroups } from "../../quiditch/constants";
import { RingGates } from "./RingGates";

export class Arena extends PhysicsMesh {
    constructor(args: PhysicsMeshArgs, radius: number, length: number) {
        super(args);

        const planeGeom = new PlaneGeometry(35, 35);
        const material = new MeshBasicMaterial({
            color: 'green',
            side: 2,
        })

        const ground = new Mesh(planeGeom, material);
        ground.position.z = 0;
        this._scene.add(ground)

        const light = new AmbientLight()
        this._scene.add(light)

        let groundBodyDesc = RAPIER.RigidBodyDesc.fixed();
        this.body = this._world.createRigidBody(groundBodyDesc);
        const polyLine = createArenaBuffer32Array(radius, length);
        const wallColider = this._world.createCollider(RAPIER.ColliderDesc.polyline(polyLine), this.body);
        wallColider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
        //wallColider.setActiveCollisionTypes(ActiveCollisionTypes.DEFAULT|ActiveCollisionTypes.DYNAMIC_FIXED)
        wallColider.setCollisionGroups(this._filterGroups);

        // const geometry = new THREE.BufferGeometry();

        // geometry.setAttribute('position', new THREE.BufferAttribute(buffer,3));

        // const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        //   color:"brown",
        //   side:2,
        //   wireframe:true
        // }));

        // scene.add(mesh)

        const gateArgs: PhysicsMeshArgs = {
            scene:this._scene,
            world:this._world,
            zHeight: this._zHeight,
            collisionMemberGroups: [CollisionGroups.gates],
            collisionFilterGroups: [CollisionGroups.ball],
            store:this.store,
            rotation:Math.PI/2
          }
          const gates = new RingGates({ ...gateArgs, translation: { x: 6, y: 0 } }, 1.5);
          const gates1 = new RingGates({ ...gateArgs, translation: { x: 6, y: 4 } }, 1);
          const gates2 = new RingGates({ ...gateArgs, translation: { x: 6, y: -4 } }, 1);

          const gates3 = new RingGates({ ...gateArgs, translation: { x: -6, y: 0 } }, 1.5);
          const gates4 = new RingGates({ ...gateArgs, translation: { x: -6, y: 4 } }, 1);
          const gates5 = new RingGates({ ...gateArgs, translation: { x: -6, y: -4 } }, 1);

    }
}