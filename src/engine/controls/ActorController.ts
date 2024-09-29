import { IActor } from "../base/Actor/IActor";
import { ITickable } from "../base/ITickable";

export abstract class ActorController<TGameActions, TActor extends IActor> implements ITickable  {

    protected _actor:TActor;
    private _isControlled:boolean = false;

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
    public isControlled():boolean{
        return this._isControlled;
    }
    public setIsControlled(control:boolean){
        this._isControlled = control;
    }

    public abstract applyAction(actionType: TGameActions, started?: boolean):Promise<void>
}