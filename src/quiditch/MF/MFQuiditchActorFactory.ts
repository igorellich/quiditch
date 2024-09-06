import { Actor } from "../../engine/base/Actor";
import { IQuiditchFactory } from "../IQuiditchActorFactory";
import { IBody } from "../../engine/MF/IBody";
import { IMesh } from "../../engine/MF/IMesh";
import { MFActor } from "../../engine/MF/MFActor";


export class MFQuiditchFactory implements IQuiditchFactory<Actor>{
    
    private readonly _bodyFactory:IQuiditchFactory<IBody>;
    private readonly _meshFactory: IQuiditchFactory<IMesh>

    constructor(bodyFactory:IQuiditchFactory<IBody>, meshFactory: IQuiditchFactory<IMesh>){
        this._bodyFactory = bodyFactory;
        this._meshFactory = meshFactory;
    }
    async createPlayer(): Promise<Actor> {
        const body = await this._bodyFactory.createPlayer();
        const mesh = await this._meshFactory.createPlayer();
        return new MFActor(body, mesh);
    }

   

}