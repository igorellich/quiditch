import { IMovable } from "../base/Actor/Imoveable";
import { IObject2D } from "../base/IObject2D";
import { ITickable } from "../base/ITickable";

export interface IBody extends IObject2D, ITickable, IMovable{
    setCollisions<TCollision>(memberGroups: TCollision[], filterGroups: TCollision[]): Promise<void>;

}