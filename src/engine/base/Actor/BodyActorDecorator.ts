import { ActorDecorator } from "./ActorDecorator";
import { IBodiedActor } from "./IBodiedActor";
import { IMovable } from "../Imoveable";
import { SceneManager } from "../SceneManager";
import { Vector2d } from "../Vector2d";
import { IBody } from "../IBody";

export class BodyActorDecorator extends ActorDecorator implements IBodiedActor {

    private readonly _sceneManager: SceneManager;

    private readonly _name:string;
    constructor(mfActor: IBodiedActor, name: string,sceneManager: SceneManager) {
        super(mfActor);
        this._sceneManager = sceneManager;
        this._name = name;
    }
    join(target: IMovable): void {
        this._baseActor.join(target);
    }
    async move(backward: boolean, delta: number): Promise<void> {
       await this._baseActor.move(backward, delta);
    }
    async rotate(right: boolean, delta: number): Promise<void> {
        await this._baseActor.rotate(right, delta);
    }
    getBody(): IBody {
        return (this._baseActor as IBodiedActor).getBody();
    }
    protected async castRay(angleDelta: number, rayLength: number) {
        const dir: Vector2d = new Vector2d(
            -Math.sin(await this.getRotation() + angleDelta),
            Math.cos(await this.getRotation() + angleDelta)).normalize();

        return this._sceneManager.castRay(await this.getPosition(), dir, rayLength, this)
    }
    public getName(){
        return this._name;
    }
}