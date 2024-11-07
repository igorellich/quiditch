import { IBody } from "../IBody";
import { IActor } from "@common/engine/IActor";

export interface IBodiedActor extends IActor{
    getBody():IBody;
   
}