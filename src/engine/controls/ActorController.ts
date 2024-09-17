import { IActor } from "../base/Actor/IActor";
import { ITickable } from "../base/ITickable";
import { InputController } from "./BaseInput";

export abstract class ActorController<TGameActions, TActor extends IActor> implements ITickable  {

    protected _actor:TActor;

    private readonly _inputControllers:InputController<TGameActions>[]=[];

    constructor(actor: TActor) {

        this._actor = actor;
        
    }
    public addInputController(controller:InputController<TGameActions> ){
        if(this._inputControllers.indexOf(controller)<0){
        this._inputControllers.push(controller);
        // init inputs
        controller.addOnInputChangeHandler((action, started) => {
            try {
                this._applyAction(action,started);
            } catch (ex) {
                console.log(ex)
            }
        });
        }
    }
    public abstract tick(elapsedTime: number, deltaTime: number): Promise<void>;
    public setActor(actor: TActor){
        this._actor = actor;
    }

    protected abstract _applyAction(actionType: TGameActions, started?: boolean):Promise<void>
}