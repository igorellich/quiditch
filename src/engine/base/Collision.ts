import { IActor } from "./Actor/IActor";

export type Collision={
    actorA?:IActor;
    actorB?:IActor;
    sensorA?:boolean;
    sensorB?:boolean;
    start?: boolean;
}