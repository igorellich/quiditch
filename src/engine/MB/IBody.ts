import { IMovable } from "../base/Imoveable";
import { ITickable } from "../base/ITickable";

export interface IBody extends ITickable, IMovable{
    setCollisions<TCollision>(memberGroups: TCollision[], filterGroups: TCollision[]): Promise<void>;



}