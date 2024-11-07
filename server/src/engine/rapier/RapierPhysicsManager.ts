import { EventQueue, Ray, World } from "@dimforge/rapier2d-compat";
import { IPhysicsManager, RayCastResult } from "../base/IPhysicsManager";
import { IActor } from "@common/engine/IActor";
import { IBodiedActor } from "../base/Actor/IBodiedActor";
import { Collision } from "@common/engine/Collision";
import { Vector2d } from "@common/engine/Vector2d";
import { RapierBasedBody } from "./RapierBasedBody";
import { GameManager } from "src/quiditch/game/GameManager";



export class RapierPhysicsManager implements IPhysicsManager {
    private readonly _world: World;
    private _collisionInfos: CollisionInfo[] = [];

    private _gameManager:GameManager|undefined;
    constructor(world: World) {
        this._world = world;
        
    }
    public init(gameManager:GameManager){
        this._gameManager = gameManager;
        gameManager.addTickable(this);
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
            if(this._gameManager){
            this.step(deltaTime);
            const collisions = this.getCollisions(this._gameManager.getActors());

            if (collisions.length > 0) {
                collisions.forEach(c => {
                    if (c.actorB) {
                        c.actorA?.onCollision(c, elapsedTime);
                    }
                    if (c.actorA) {
                        c.actorB?.onCollision(c, elapsedTime);
                    }

                })
            }
        }
        
    }
    async castRay(origin: Vector2d, dir: Vector2d, rayLength: number, sourceActor?: IBodiedActor, targetActors?: IBodiedActor[]): Promise<RayCastResult> {
        const body = sourceActor?.getBody() as RapierBasedBody;
        const result: RayCastResult = { hit: false };
        //console.log(origin,dir)
        const castResult = this._world.castRay(new Ray(origin, dir), rayLength, false, undefined,
        undefined, undefined, body.getRigidBody());
        if (castResult) {
            // console.log(castResult)
            await this._world.bodies.forEach(async body => {

                if (body === castResult.collider.parent()) {
                    result.hit = true;
                    result.instance = targetActors?.find(a => a.getBody && (a.getBody() as RapierBasedBody).getRigidBody() === body);

                    const point: Vector2d = new Vector2d(
                        origin.x + dir.x * castResult.timeOfImpact,
                        origin.y + dir.y * castResult.timeOfImpact
                    );
                    result.distance = (new Vector2d(point.x - origin.x, point.y - origin.y)).length();
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
    getCollisions(actors: IActor[]): Collision[] {
        const result: Collision[] = [];
        for (const colInfo of this._collisionInfos) {
            const collision: Collision = { actorA: undefined, actorB: undefined, sensorA:undefined, sensorB:undefined }
            for (const actor of actors) {
                if ((actor as IBodiedActor)?.getBody) {
                    const rigidBody = ((actor as IBodiedActor)?.getBody() as RapierBasedBody)?.getRigidBody();
                    if (rigidBody) {
                        for (let i = 0; i < rigidBody.numColliders(); i++) {
                            const currCollider = rigidBody.collider(i);
                            const handle = currCollider.handle;
                          
                            if (colInfo.c1 == handle || colInfo.c2 == handle) {
                               
                                collision.start = colInfo.start;
                                if (!collision.actorA) {
                                    collision.actorA = actor;
                                    if(currCollider.isSensor()){
                                        collision.sensorA = true;
                                    }
                                } else {
                                    collision.actorB = actor;
                                    if(currCollider.isSensor()){
                                        collision.sensorB = true;
                                    }
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