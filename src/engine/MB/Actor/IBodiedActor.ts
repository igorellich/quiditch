import { IBody } from "../IBody";
import { IActor } from "../../base/Actor/IActor";

export interface IBodiedActor extends IActor{
    getBody():IBody;
   
}