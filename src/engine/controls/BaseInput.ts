import { InputInterface } from "./IInputInterface";

export class InputController<T> implements InputInterface<T>{
    private readonly _handlers:((action: T, started: boolean) => void)[]=[];
    addOnInputChangeHandler(handler: (action: T, started: boolean) => void): void {
        this._handlers.push(handler)
    }
    
    removeOnInputChangeHandler(handler: (action: T, started: boolean) => void): void {
        const index  = this._handlers.indexOf(handler);
        if(index>=0){
        this._handlers.slice(index,1);
        }
    }
    protected async _onInputChange(action:T, started:boolean){
        for(const h of this._handlers){
            await h(action,started)
        }
    }

}