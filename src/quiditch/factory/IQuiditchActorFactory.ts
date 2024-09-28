import { IActor } from "../../engine/base/Actor/IActor";
import { IObject2D } from "../../engine/base/IObject2D";

export interface IQuiditchFactory<T>{
    createPlayer(color?:string):Promise<T>;
    createQuaffle():Promise<T>;
    createGround():Promise<T>;
    
    createWalls():Promise<T>;

    createPointer(targetObject?: IObject2D, sourceActor?:IActor):Promise<T>;

    createGates(ringRadius:number):Promise<T>;
}