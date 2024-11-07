import { IMovable } from "@common/engine/Imoveable";
import { ITickable } from "@common/engine/ITickable";

export interface IBody extends ITickable, IMovable{
    setCollisions<TCollision>(memberGroups: TCollision[], filterGroups: TCollision[]): Promise<void>;



}