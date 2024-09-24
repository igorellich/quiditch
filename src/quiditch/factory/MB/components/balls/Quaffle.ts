import { Collision } from "../../../../../engine/base/Collision";
import { BodyActorDecorator } from "../../../../../engine/MB/Actor/BodyActorDecorator";

export class Quaffle extends BodyActorDecorator{
        async onCollision(collision: Collision, elapsedTime: number): Promise<void> {
            console.log(collision);
        }
}