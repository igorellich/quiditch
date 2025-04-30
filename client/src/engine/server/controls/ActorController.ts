import { IActor } from "@common/IActor";
import { ITickable } from "@common/ITickable";

export abstract class ActorController<TGameActions, TActor extends IActor> implements ITickable  {

    protected _actor:TActor;
    constructor(actor: TActor) {

        this._actor = actor;
    }
  
    public async tick(elapsedTime: number, deltaTime: number): Promise<void>{
       
    }
    public setActor(actor: TActor){
        this._actor = actor;
    }
    public getActor():TActor{
                return this._actor; 
    }
    

    public abstract applyAction(actionType: TGameActions, started?: boolean):Promise<void>
}