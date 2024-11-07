import { IActor } from "./IActor";

export type Collision={
    actorA?:IActor;
    actorB?:IActor;
    sensorA?:boolean;
    sensorB?:boolean;
    start?: boolean;
}