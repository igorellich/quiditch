import { ActorDecorator } from "../base/ActorDecorator";
import { IBodiedActor } from "../base/IBodiedActor";
import { IBody } from "./IBody";
import { MFActor } from "./MFActor";

export class BodyActorDecorator extends ActorDecorator implements IBodiedActor{
    constructor(mfActor:MFActor){
        super(mfActor);
    }
    getBody(): IBody {
       return (this._baseActor as MFActor).getBody();
    }
}