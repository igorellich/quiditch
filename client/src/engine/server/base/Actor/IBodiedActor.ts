import { IBody } from "../IBody";
import { IActor } from "@common/IActor";

export interface IBodiedActor extends IActor{
    getBody():IBody;
   
}