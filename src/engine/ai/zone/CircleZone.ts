import { Vector2d } from "../../base/Vector2d";
import { IZone } from "./IZone";

export class CircleZone implements IZone<Vector2d>{

    private readonly _radius: number;
    private readonly _center:Vector2d;
    constructor(radius:number, center:Vector2d){
        this._radius = radius;
        this._center = center;
    }
    async getRandomPoint(): Promise<Vector2d> {
        const angle = Math.random() * 2 * Math.PI;
        const dist = Math.random() * this._radius;
        return new Vector2d(Math.sin(angle) * dist+ this._center.x, Math.cos(angle) * dist +this._center.y)
    }
   async belongs(point: Vector2d): Promise<boolean> {
       return this._center.distanceTo(point)<this._radius; 
    }

}