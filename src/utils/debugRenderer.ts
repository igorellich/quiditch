
import RAPIER from '@dimforge/rapier2d'
import * as THREE from 'three'
import { ITickable } from '../engine/base/ITickable'
export class RapierDebugRenderer implements ITickable {
    mesh
    world
    enabled = true

    private readonly _zHeight:number;
  
    constructor(scene: THREE.Scene, world: RAPIER.World, zHeight: number) {
      this.world = world
      this._zHeight = zHeight;
      this.mesh = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true }))
      this.mesh.frustumCulled = false
      scene.add(this.mesh)
    }

  
    public async tick(elapsedTime: number, deltaTime: number):Promise<void> {
      if (this.enabled) {
        const { vertices, colors } = this.world.debugRender()
        this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 2))
        this.mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))
        this.mesh.visible = true
        this.mesh.position.z = this._zHeight + 0.1;
      } else {
        this.mesh.visible = false
      }
    }
  }