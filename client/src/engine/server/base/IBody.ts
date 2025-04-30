import { IMovable } from "@common/Imoveable";
import { ITickable } from "@common/ITickable";

export interface IBody extends ITickable, IMovable{
    setCollisions<TCollision>(memberGroups: TCollision[], filterGroups: TCollision[]): Promise<void>;



}