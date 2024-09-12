import { EventQueue, QueryFilterFlags, Ray, World } from "@dimforge/rapier2d";
import { Actor } from "../../base/Actor";
import { IPhysicsManager, RayCastResult } from "../../base/IPhysicsManager";
import { Collision } from "../../base/Collision";
import { MFActor } from "../MFActor";
import { RapierBasedBody } from "./RapierBasedBody";
import { Vector2d } from "../../base/Vector2d";
import { Vector2 } from "three";

export class RapierPhysicsManager implements IPhysicsManager {
    private readonly _world: World;
    private _collisionInfos: CollisionInfo[] = [];
    constructor(world: World) {
        this._world = world;
    }
    async castRay(origin: Vector2d, dir: Vector2d, rayLength: number, sourceActor?: MFActor, targetActors?: MFActor[]): Promise<RayCastResult> {
        const body = sourceActor.getBody() as RapierBasedBody;
        const result: RayCastResult = { hit: false };
        //console.log(origin,dir)
        const castResult = this._world.castRay(new Ray(origin, dir), rayLength, false, undefined,
        undefined, undefined, body.getRigidBody());
        if (castResult) {
            await this._world.bodies.forEach(async body => {

                if (body === castResult.collider.parent()) {
                    result.hit = true;
                    result.instance = targetActors.find(a => (a.getBody() as RapierBasedBody).getRigidBody() === body);

                    const point: Vector2d = {
                        x: origin.x + dir.x * castResult.timeOfImpact,
                        y: origin.y + dir.y * castResult.timeOfImpact
                    };
                    result.distance = (new Vector2(point.x - origin.x, point.y - origin.y)).length();
                }
            })
        }
        return result;

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