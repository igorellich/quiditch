
import { BodyActorDecorator } from "../../../../../engine/server/base/Actor/BodyActorDecorator";
import { Collision } from "@common/Collision";

export class Quaffle extends BodyActorDecorator {

    private _lastJoinTime: number = 0;
    async onCollision(collision: Collision, elapsedTime: number): Promise<void> {
        const joints = await this.getJoints();
        if (joints.length === 0) {
            if (elapsedTime - this._lastJoinTime >= 2000) {
                const player = collision.actorA?.getName() == "player" ? collision.actorA : collision.actorB?.getName() == "player" ? collision.actorB : null;
                if (player) {
                    this._lastJoinTime = elapsedTime;
                    player.join(this);
                }
            } 
        }
    }
}