import { RigidBody, World } from "@dimforge/rapier2d";
import {  Object3D, Scene } from "three";
import { CollisionGroups } from "../constants";
import { interactionGroups } from "../utils/interaction-groups";


export abstract class PhysicsMesh {
    protected readonly _scene: Scene;
    protected readonly _world: World;
    protected readonly _zHeight: number;
    protected readonly _translation: Vector;
    protected readonly _rotation: Vector;
    protected readonly _filterGroups:number;
    public mesh:Object3D|undefined;
    public body:RigidBody|undefined;


    constructor(argsObj: PhysicsMeshArgs) {
        this._scene = argsObj.scene;
        this._world = argsObj.world;
        this._zHeight = argsObj.zHeight;
        this._translation = argsObj.translation||{x:0,y:0,z:0};
        this._rotation = argsObj.rotation || {x:0, y:0, z:0};
        this._filterGroups = interactionGroups(argsObj.collisionMemberGroups||[],argsObj.collisionFilterGroups||[]);
      
    }
    public abstract update(): void;
   
}
export class Vector {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;
}

export  type PhysicsMeshArgs = {
    scene: Scene
    world: World
    zHeight: number
    translation?: Vector
    rotation?: Vector,
    collisionMemberGroups?:CollisionGroups[],
    collisionFilterGroups?:CollisionGroups[],
}