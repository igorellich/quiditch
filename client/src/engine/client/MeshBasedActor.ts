import { Actor } from "@common/Actor";
import { Collision } from "@common/Collision";
import { IMovable } from "@common/Imoveable";
import { Vector2d } from "@common/Vector2d";
import { IMesh } from "./IMesh";
import { Camera } from "three";
import { ActorState } from "@common/ActorState";

export class MeshBasedActor extends Actor {
    async onCollision(collision: Collision): Promise<void> {

    }
    private readonly _scale:number=1;
    private readonly _mesh: IMesh

    constructor(name: string, mesh: IMesh, id: string, scale?: number) {
        super(name, undefined, undefined, id);
        this._mesh = mesh;  
        if(scale){
        this._scale = scale;
        }
    }
    public override async setState(state: ActorState): Promise<void> {
        const scaledState = {...state, position:{x:state.position.x*this._scale, y:state.position.y*this._scale}}
        await super.setState(scaledState);
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
        this._mesh.setPosition(x*this._scale, y*this._scale);
    }
    async getPosition(): Promise<Vector2d> {
        const pos = await this._mesh.getPosition();
        return new Vector2d(pos.x / this._scale, pos.y / this._scale);
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