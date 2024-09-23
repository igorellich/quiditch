export interface ITargetPointer<TPoint>{
    setTargetPoint(point?:TPoint):void;
    isTargetReached(): boolean;
}