import { IActor } from "./Actor/IActor";

export type Collision={
    actorA?:IActor;
    actorB?:IActor;
    sensor?:boolean;
    start?: boolean;
}