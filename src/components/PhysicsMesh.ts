import RAPIER, { RigidBody, World } from "@dimforge/rapier2d";
import { Object3D, Vector2 } from "three";
import { CollisionGroups } from "../quiditch/constants";
import { interactionGroups } from "../utils/interaction-groups";
import SimpleScene from "./SimpleScene";
import { InstanceStore } from "./store/InstanceStore";


export abstract class PhysicsMesh {
    protected readonly _scene: SimpleScene;
    protected readonly _world: World;
    protected readonly _zHeight: number;
    protected _translation: Vector;
    protected _rotation: number;
    protected readonly _filterGroups: number;
    public mesh: Object3D | undefined;
    public body: RigidBody | undefined;
    protected readonly store: InstanceStore


    constructor(argsObj: PhysicsMeshArgs) {
        this._scene = argsObj.scene;
        this._world = argsObj.world;
        this._zHeight = argsObj.zHeight;
        this._translation = argsObj.translation || { x: 0, y: 0 };
        this._rotation = argsObj.rotation ||0.0;
        this._filterGroups = interactionGroups(argsObj.collisionMemberGroups || [], argsObj.collisionFilterGroups || []);
        this._scene.addUpdateHandler((elapsedTime:number)=>{
            this.update(elapsedTime);
        })
        this.store = argsObj.store;
        this.store.add(this);

    }
    public update(elapsedTime:number): void {
        if (this.mesh && this.body) {
            this._rotation = this.body.rotation()
            this._translation = this.body.translation();
            this.mesh.position.x = this._translation.x;
            this.mesh.position.y = this._translation.y;
            this.mesh.rotation.z = this._rotation;
        }
    };
    protected _castRay(rayLength: number = 1, angleDelta:number = 0):RayCastResult{
        const result:RayCastResult = {
            hit:false
        }
        const dir = new RAPIER.Vector2(Math.sin(this._rotation+angleDelta), Math.cos(this._rotation + angleDelta));
        const hit = this._world.castRay(new RAPIER.Ray(this._translation,
            dir), rayLength, false, undefined,
            undefined, undefined, this.body);
        if (hit) {
            const body = hit.collider.parent();
            const instance = this.store.getIntanceByBody(body as RigidBody);

            if (instance) {
                const point: Vector2 = new Vector2(this._translation.x + dir.x * hit.timeOfImpact, this._translation.y + dir.y * hit.timeOfImpact);
                const dist = (new Vector2(point.x - this._translation.x, point.y - this._translation.y)).length();
                result.hit = true;
                result.instance = instance;
                result.distance = dist;
              
            }
        }
        return result;
    }
    public getDirectionVector(): Vector2 | undefined {
        let result = undefined
        if (this.body) {
            result = new Vector2(-Math.sin(this.body.rotation()), Math.cos(this.body.rotation()));
        }
        return result;
    }

}

export type RayCastResult={
    hit:boolean, instance?: PhysicsMesh, distance?:number
}

export class Vector {
    public x: number = 0;
    public y: number = 0;
}

export type PhysicsMeshArgs = {
    scene: SimpleScene
    world: World
    zHeight: number
    translation?: Vector
    rotation?: number,
    collisionMemberGroups?: CollisionGroups[],
    collisionFilterGroups?: CollisionGroups[],
    store: InstanceStore
}