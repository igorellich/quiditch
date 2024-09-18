import { IActor } from "./IActor";
import { Vector2d } from "../Vector2d";
import { IMovable } from "../Imoveable";
import { IObject2D } from "../IObject2D";

export abstract class Actor implements IActor {


    public readonly _name: string;
    constructor(name: string, speed: number = 0, rotationSpeed: number = 0) {
        this.setSpeed(speed);
        this.setRotationSpeed(rotationSpeed);
    }
    getName(): string {
        return this._name;
    }
    abstract unjoin(target: IMovable): Promise<void>;
    abstract join(target: IMovable): Promise<void>;
    abstract getSpeed(): number;
    abstract getRotationSpeed(): number;
    abstract setSpeed(speed: number): void;
    abstract setRotationSpeed(rotationSpeed: number): void;
    abstract move(backward: boolean, delta: number): Promise<void>;
    abstract rotate(right: boolean, delta: number): Promise<void>;
    public async getDirectionVector(): Promise<Vector2d | undefined> {
        let result: Vector2d = undefined

        result = new Vector2d(-Math.sin(await this.getRotation()), Math.cos(await this.getRotation()));

        return result;
    }

    public async getAngelToTarget(target: Vector2d): Promise<number> {// radians
        const actorDirection = await this.getDirectionVector();
        let angle = 0;
        if (target && actorDirection) {

            const actorPosition = await this.getPosition();
            const tagerDirection = (new Vector2d(target.x - actorPosition.x,
                target.y - actorPosition.y)).normalize();
            const atan1 = Math.atan2(actorDirection.y, actorDirection.x);
            const atan2 = Math.atan2(tagerDirection.y, tagerDirection.x);
            angle = (atan2 - atan1);
            // console.log(angle*180/Math.PI)
            if (Math.abs(angle) > Math.PI) {
                angle = angle > 0 ?angle- 2 * Math.PI: 2 * Math.PI + angle;              
            }
        }
        return angle;
    }


    public abstract setPosition(x: number, y: number): Promise<void>;
    public abstract getPosition(): Promise<Vector2d>;
    public abstract setRotation(rotation: number): Promise<void>;
    public abstract getRotation(): Promise<number>;

    public abstract tick(elapsedTime: number, deltaTime: number): Promise<void>;

    public abstract setCollisions<TCollision>(memberGroups: TCollision[], filterGroup: TCollision[]): Promise<void>;

}