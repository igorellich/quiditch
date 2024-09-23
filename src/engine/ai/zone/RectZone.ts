import { Vector2d } from "../../base/Vector2d";
import { IZone } from "./IZone";

export class RectZone implements IZone<Vector2d> {

    private readonly _ltPoint: Vector2d;

    private readonly _rbPoint: Vector2d;

    constructor(tlPoint: Vector2d, rbPoint: Vector2d) {
        this._rbPoint = rbPoint;
        this._ltPoint = tlPoint;
    }
    async getRandomPoint(): Promise<Vector2d> {

        const x = Math.random() * (this._rbPoint.x - this._ltPoint.x) + this._ltPoint.x;
        const y = Math.random() * (this._rbPoint.y - this._ltPoint.y) + this._ltPoint.y;
        return new Vector2d(x, y);
    }
    async belongs(point: Vector2d): Promise<boolean> {
        return point.x > this._ltPoint.x && point.y > this._ltPoint.y && point.x < this._rbPoint.x && point.y < this._rbPoint.y;
    }

}