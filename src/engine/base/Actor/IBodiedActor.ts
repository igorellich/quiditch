import { IBody } from "../../MF/IBody";
import { IActor } from "./IActor";

export interface IBodiedActor extends IActor{
    getBody():IBody;
    getName():string;
}