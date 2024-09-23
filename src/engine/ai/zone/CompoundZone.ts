import { IZone } from "./IZone";

export class CompoundZone<TPoint> implements IZone<TPoint>{
    private readonly _children:IZone<TPoint>[];
    constructor(children:IZone<TPoint>[]){
        this._children = children;
    }
    getRandomPoint(): Promise<TPoint> {
        return this._children[Math.floor(Math.random()*this._children.length)].getRandomPoint();
    }
    async belongs(point: TPoint): Promise<boolean> {
        let result = false;
        for(const zone of this._children){
            if(result){
                break;
            }else{
                result = await zone.belongs(point);
            }
        }
        return result;
    }

}