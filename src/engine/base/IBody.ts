import { IMovable } from "./Imoveable";
import { IObject2D } from "./IObject2D";
import { ITickable } from "./ITickable";

export interface IBody extends IObject2D, ITickable, IMovable{
    setCollisions<TCollision>(memberGroups: TCollision[], filterGroups: TCollision[]): Promise<void>;

}