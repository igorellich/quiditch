import { IBody } from "../IBody";
import { IActor } from "./IActor";

export interface IBodiedActor extends IActor{
    getBody():IBody;
    getName():string;
}