import { IActor } from "./IActor";
import { Vector2d } from "../Vector2d";
import { IMovable } from "../Imoveable";
import { Collision } from "../Collision";
import { IObject2D } from "../IObject2D";

export class ActorDecorator implements IActor {
    protected readonly _baseActor: IActor;
    constructor(baseActor: IActor) {
        this._baseActor = baseActor;
    }
    getJoints(): Promise<IMovable[]> {
        return this._baseActor.getJoints();
    }
    async onJoin(target: IMovable): Promise<void> {
        //console.log("on join")
        this._baseActor.onJoin(target);
    }
    async onUnjoin(target: IMovable): Promise<void> {
        this._baseActor.onUnjoin(target);
    }
   
    async onCollision(collision: Collision, elapsedTime: number): Promise<void> {
        this._baseActor.onCollision(collision, elapsedTime);
    }
    getAngelToTarget(target: Vector2d): Promise<number> {
        return this._baseActor.getAngelToTarget(target);
    }
    getName(): string {
        return this._baseActor.getName();
    }
    unjoin(target: IMovable): Promise<void> {
       return this._baseActor.unjoin(target);
    }
    join(target: IMovable): Promise<void> {
        return this._baseActor.join(target);
    }
    move(backward: boolean, delta:number): Promise<void> {
        return this._baseActor.move(backward, delta);
    }
    rotate(right: boolean, delta:number): Promise<void> {
        return this._baseActor.rotate(right,delta);
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