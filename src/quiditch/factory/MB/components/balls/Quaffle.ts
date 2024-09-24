import { Collision } from "../../../../../engine/base/Collision";
import { BodyActorDecorator } from "../../../../../engine/MB/Actor/BodyActorDecorator";

export class Quaffle extends BodyActorDecorator {

    private _unjoinTime: number = 2;
    async onCollision(collision: Collision, elapsedTime: number): Promise<void> {
        const joints = await this.getJoints();
        if (joints.length === 0) {
            if (this._unjoinTime >= 2) {
                const player = collision.actorA?.getName() == "player" ? collision.actorA : collision.actorB?.getName() == "player" ? collision.actorB : null;
                if (player) {
                    this._unjoinTime = 0;
                    player.join(this);
                }
            } else {
                this._unjoinTime += elapsedTime;
            }
        }
    }
}