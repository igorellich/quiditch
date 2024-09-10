import { EventQueue, World } from "@dimforge/rapier2d";
import { Actor } from "../../base/Actor";
import { ICollisionManager } from "../../base/ICollisionManager";
import { Collision } from "../../base/Collision";
import { MFActor } from "../MFActor";
import { RapierBasedBody } from "./RapierBasedBody";

export class RapierCollisionManager implements ICollisionManager {
    private readonly _world: World;
    private _collisionInfos: CollisionInfo[] = [];
    constructor(world: World) {
        this._world = world;
    }
    step(delta: number): void {
        this._world.timestep = Math.min(delta, 0.1)
        this._collisionInfos = [];
        const eventQueue = new EventQueue(true);
        this._world.step(eventQueue)
        eventQueue.drainCollisionEvents((c1, c2, start) => {
            this._collisionInfos.push({ c1, c2, start })
        })
    }
    getCollisions(actors: Actor[]): Collision[] {
        const result: Collision[] = [];
        for (const colInfo of this._collisionInfos) {
            const collision: Collision = { actorA: undefined, actorB: undefined }
            for (const actor of actors) {
                if ((actor as MFActor)?.getBody) {
                    const rigidBody = ((actor as MFActor)?.getBody() as RapierBasedBody)?.getRigidBody();
                    if (rigidBody) {
                        for (let i = 0; i < rigidBody.numColliders(); i++) {
                            const handle = rigidBody.collider(i).handle;
                            if (colInfo.c1 == handle || colInfo.c2 == handle) {
                                if (!collision.actorA) {
                                    collision.actorA = actor;
                                } else {
                                    collision.actorB = actor;
                                }
                            }
                        }
                    }
                }
            }
            if (collision.actorA) {
                result.push(collision);
            }
        }
        return result;
    }

}
type CollisionInfo = {
    c1: number;
    c2: number;
    start: boolean;
}