import { IActor } from "./IActor";
import { Vector2d } from "./Vector2d";

export class ActorDecorator implements IActor {
    private readonly _baseActor: IActor;
    constructor(baseActor: IActor) {
        this._baseActor = baseActor;
    }
    setPosition(x: number, y: number): Promise<void> {
        return this._baseActor.setPosition(x, y);
    }
    getPosition(): Promise<Vector2d> {
        return this._baseActor.getPosition();
    }
    setRotation(rotation: number): Promise<void> {
        return this._baseActor.setRotation(rotation);
    }
    getRotation(): Promise<number> {
        return this._baseActor.getRotation();
    }
    tick(elapsedTime: number, deltaTime: number): Promise<void> {
        return this._baseActor.tick(elapsedTime, deltaTime);
    }


}