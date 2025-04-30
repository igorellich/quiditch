import { Actor } from "@common/Actor";
import { Collision } from "@common/Collision";
import { IMovable } from "@common/Imoveable";
import { Vector2d } from "@common/Vector2d";
import { IMesh } from "./IMesh";
import { Camera } from "three";

export class MeshBasedActor extends Actor {
    async onCollision(collision: Collision): Promise<void> {

    }

    private readonly _mesh: IMesh

    constructor(name: string, mesh: IMesh, id: string) {
        super(name, undefined, undefined, id);
        this._mesh = mesh;

    }

    async unjoin(target: IMovable): Promise<void> {
        //TODO
    }
    async join(target: IMovable): Promise<void> {
        //TODO
    }
    setSpeed(speed: number): void {
        //TODO
    }
    setRotationSpeed(rotationSpeed: number): void {
        //TODO
    }
    async move(backward?: boolean): Promise<void> {
        //TODO
        return;
    }
    async rotate(right?: boolean): Promise<void> {
        //TODO
        return;
    }
    async getDirectionVector(): Promise<Vector2d> {
        return new Vector2d(-Math.sin(await this.getRotation()), Math.cos(await this.getRotation()));
    }
    getSpeed(): number {
        return 0;
    }
    getRotationSpeed(): number {
        return 0;
    }
    async setPosition(x: number, y: number): Promise<void> {
        this._mesh.setPosition(x, y);
    }
    getPosition(): Promise<Vector2d> {
        return this._mesh.getPosition();
    }
    async setRotation(rotation: number): Promise<void> {
        this._mesh.setRotation(rotation);
    }
    getRotation(): Promise<number> {
        return this._mesh.getRotation();
    }
    getMesh() {
        return this._mesh;
    }

    async tick(elapsedTime: number, deltaTime: number): Promise<void> {

    }

    public async setCollisions<TCollision>(memberGroups: TCollision[], filterGroup: TCollision[]): Promise<void> {

    }
}