import { IObject2D } from "../base/IObject2D";
import { ITickable } from "../base/ITickable";

export interface IBody extends IObject2D, ITickable{
    setCollisions<TCollision>(memberGroups: TCollision[], filterGroups: TCollision[]): Promise<void>;

}