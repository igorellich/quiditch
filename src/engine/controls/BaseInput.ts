import { InputInterface } from "./IInputInterface";

export class BaseInput<T> implements InputInterface<T>{
    private readonly _handlers:((action: T, started: boolean) => void)[]=[];
    removeOnInputChangeHandler(handler: (action: T, started: boolean) => void): void {
        this._handlers.push(handler)
    }
    
    addOnInputChangeHandler(handler: (action: T, started: boolean) => void): void {
        const index  = this._handlers.indexOf(handler);
        if(index>=0){
        this._handlers.slice(index,1);
        }
    }
    protected _onInputChange(action:T, started:boolean){
        this._handlers.forEach(h=>h(action,started))
    }

}