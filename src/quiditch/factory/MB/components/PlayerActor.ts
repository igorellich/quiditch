import { BodyActorDecorator } from "../../../../engine/MB/Actor/BodyActorDecorator";

export class PlayerActor extends BodyActorDecorator {

   
    public override async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        await super.tick(elapsedTime, deltaTime);

        

        //const castResult = await this.castRay(0,5);
        // if (castResult && castResult.hit && !this._jointActor && castResult.instance && castResult.instance.getName()==="ball") {
            
        //     if (castResult.distance && castResult.distance < 5) {
        //         await this.join(castResult.instance);
        //         this._jointActor = castResult.instance;
        //     }

        // }
    }

    public async attack():Promise<void>{
        const joints = await this.getJoints();
        for(const j of joints){
            this.unjoin(j);
            await j.move(false, 1/60);
        }       
    }
}