import { ActorNames } from "@common/quiditch/constants";
import {BaseState} from "./BaseState";
export class ActorState extends BaseState{
    position: {x:number, y:number}={x:0,y:0};
    rotation: number=0;    
    id: string="";
}