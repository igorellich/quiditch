export interface IMovable{
    move(backward:boolean, delta:number):void;
    rotate(right:boolean, delta:number):void;
    getSpeed():number

    getRotationSpeed():number

    setSpeed(speed:number):void;
    setRotationSpeed(rotationSpeed:number):void;

}