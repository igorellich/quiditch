import { IActor } from "./IActor";
import { Vector2d } from "../Vector2d";

export class ActorDecorator implements IActor {
    protected readonly _baseActor: IActor;
    constructor(baseActor: IActor) {
        this._baseActor = baseActor;
    }
    move(backward?: boolean): void {
        this._baseActor.move(backward);
    }
    rotate(right?: boolean): void {
        this._baseActor.rotate(right);
    }
    setSpeed(speed: number): void {
        this._baseActor.setSpeed(speed);
    }
    setRotationSpeed(rotationSpeed: number): void {
        this._baseActor.setRotationSpeed(rotationSpeed);
    }
    getDirectionVector(): Promise<Vector2d> {
        return this._baseActor.getDirectionVector();
    }
    getSpeed(): number {
        return this._baseActor.getSpeed();
    }
    getRotationSpeed(): number {
        return this._baseActor.getRotationSpeed();
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