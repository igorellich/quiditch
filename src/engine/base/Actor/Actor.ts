import { IActor } from "./IActor";
import { Vector2d } from "../Vector2d";
import { IMovable } from "../Imoveable";
import { Collision } from "../Collision";
import { IObject2D } from "../IObject2D";
import {normaliseAngle} from "../../../utils/geometryUtils"

export abstract class Actor implements IActor {


    public readonly _name: string;
    constructor(name: string, speed: number = 0, rotationSpeed: number = 0) {
        this.setSpeed(speed);
        this._name = name;
        this.setRotationSpeed(rotationSpeed);
    }
    async getJoints(): Promise<IMovable[]> {
        //console.log(this._joints);
        return [...this._joints];
    }
    async onJoin(target: IMovable): Promise<void> {
        //console.log("on join")
        this._addJoint(target);
    }
    async onUnjoin(target: IMovable): Promise<void> {
        this._removeJoint(target);
    }

    protected _joints: IMovable[] = [];
    _addJoint(actor: IMovable): void {
        if(this._joints.indexOf(actor)<0){
            this._joints.push(actor);
        }
    }
    _removeJoint(actor: IMovable): void {
        const jointIndex = this._joints.indexOf(actor);
        if (jointIndex >= 0) {
            this._joints.splice(jointIndex, 1);
        }
    }
    abstract onCollision(Collision: Collision): Promise<void>;
    getName(): string {
        return this._name;
    }
    public async unjoin(target: IMovable): Promise<void>{
      
        this.onUnjoin(target);
        target.onUnjoin(this);
    };
    public async join(target: IMovable): Promise<void>{
        this.onJoin(target);
        target.onJoin(this);
    };
    abstract getSpeed(): number;
    abstract getRotationSpeed(): number;
    abstract setSpeed(speed: number): void;
    abstract setRotationSpeed(rotationSpeed: number): void;
    abstract move(backward: boolean, delta: number): Promise<void>;
    abstract rotate(right: boolean, delta: number): Promise<void>;
    public async getDirectionVector(): Promise<Vector2d> {
        let result: Vector2d;

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
           angle = normaliseAngle(angle);
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