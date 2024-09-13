export interface IMovable{
    move(backward?:boolean):void;
    rotate(right?:boolean):void;
    getSpeed():number

    getRotationSpeed():number

    setSpeed(speed:number):void;
    setRotationSpeed(rotationSpeed:number):void;

}