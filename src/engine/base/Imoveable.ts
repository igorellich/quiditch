export interface IMovable{
    move(backward:boolean, delta:number):Promise<void>;
    rotate(right:boolean, delta:number):Promise<void>;
    getSpeed():number

    getRotationSpeed():number

    setSpeed(speed:number):void;
    setRotationSpeed(rotationSpeed:number):void;

    join(target: IMovable):Promise<void>;
    unjoin(target: IMovable):Promise<void>;

}