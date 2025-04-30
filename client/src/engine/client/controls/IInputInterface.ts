export interface InputInterface<T> {
    addOnInputChangeHandler(handler:(action: T, started:boolean)=>void): void;
    removeOnInputChangeHandler(handler:(action: T, started:boolean)=>void): void;    
}