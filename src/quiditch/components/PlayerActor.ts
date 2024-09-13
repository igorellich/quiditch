import { BodyActorDecorator } from "../../engine/MF/BodyActorDecorator";

export class PlayerActor extends BodyActorDecorator {
    public override async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        await super.tick(elapsedTime, deltaTime);

        const castResult = await this.castRay(0, 5);
        if (castResult.hit) {
            if (castResult.distance < 4) {
                this.join(castResult.instance);
            }

        }
    }
}