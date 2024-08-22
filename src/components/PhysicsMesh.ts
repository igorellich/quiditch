import { World } from "@dimforge/rapier2d";
import { Scene } from "three";


export abstract class PhysicsMesh{
    protected readonly _scene: Scene;
    protected readonly _world: World;
    protected readonly _zHeight: number;
    protected readonly _translation: Vector;
    protected readonly _rotation: Vector;
   

    constructor(scene: Scene, world: World, zHeight: number =1, translation:Vector= {x:0, y:0, z:0}, rotation: Vector= {x:0, y:0, z:0}) {
        this._scene = scene;
        this._world = world;
        this._zHeight = zHeight;
        this._translation = translation;
        this._rotation = rotation;
        setTimeout(()=>{
            this._build();
        },50)
        
    }
     protected abstract _build():void;
}
export class Vector{
    public x:number = 0;
    public y: number = 0;
    public z: number = 0;
}