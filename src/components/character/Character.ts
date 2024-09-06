import RAPIER, { RigidBody } from "@dimforge/rapier2d";
import { PhysicsMesh, PhysicsMeshArgs } from "../PhysicsMesh";
import { ConeGeometry, Mesh, MeshBasicMaterial } from "three";

import { HitBall } from "../balls/HitBall";
import { ContactBall } from "../balls/ContactBall";
import { BaseBall } from "../balls/BaseBall";

export class Character extends PhysicsMesh {
    spawnBall() {
        new HitBall({
            scene:this._scene,
            world:this._world,
            zHeight:this._zHeight,
            rotation:this._rotation,
            translation:this._translation,
            store:this.store
        })
    }

    private _characterController: RAPIER.KinematicCharacterController | undefined;
    private _characterCollider: RAPIER.Collider | undefined;

    private _speed:number = 0;
    private _rotationSpeed:number = 0;


    private _ball: BaseBall|undefined;

    public setSpeed(speed:number){
        this._speed = speed;
    }
    public hasBall():boolean{
        return this._ball!=undefined;
    }
    public setRotationSpeed(rotationSpeed:number){
        this._rotationSpeed = rotationSpeed;
    }   
    
    constructor(argsObj: PhysicsMeshArgs) {
        super(argsObj);
       
        // Character.
        this.mesh = new Mesh(new ConeGeometry(0.2, 2, 16), new MeshBasicMaterial({
            color: 'black'
        }));

        this.mesh.position.set(this._translation.x, this._translation.y, this._zHeight)

        this._scene.add(this.mesh);

        this._characterController = this._world.createCharacterController(0.1);
        let characterDesc =
            RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(this._translation.x, this._translation.y);
        this.body = this._world.createRigidBody(characterDesc);
        let characterColliderDesc = RAPIER.ColliderDesc.ball(0.4)
        this._characterCollider = this._world.createCollider(
            characterColliderDesc,
            this.body,
        );
        this._characterCollider.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT | RAPIER.ActiveCollisionTypes.KINEMATIC_FIXED);
        this._characterCollider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)        

    }
    attack() {
        if (this._ball && this._ball.body) {
            const joint = this._ball.getJoin()
            if((joint?.body1()==this.body || joint?.body1()==this.body)&&  this._ball.unJoin()){
                const impules = { x: -Math.sin(this._rotation) * 5, y: Math.cos(this._rotation) * 5 };

                this._ball.body?.applyImpulse(impules, true)
                this._ball = undefined;
    
            }
            
        }
    }

    private castRayDeltaAngle:number=0;
    public update(elapsedTime:number): void {
        if (this.body && this._characterController && this._characterCollider && this.mesh) {
            this.body.setRotation(this.body.rotation() + this._rotationSpeed, false);
            const directionVector = new RAPIER.Vector2(
                -Math.sin(this.body.rotation()) * this._speed,
                Math.cos(this.body.rotation()) * this._speed
            )

            this._characterController.computeColliderMovement(this._characterCollider,
                directionVector,
                RAPIER.QueryFilterFlags.EXCLUDE_SENSORS,
                this._filterGroups
            );

            const movement = this._characterController.computedMovement();
            this._characterController.setApplyImpulsesToDynamicBodies(true)
            const newPos = this.body.translation();
            newPos.x += movement.x;
            newPos.y += movement.y;
            this.body.setNextKinematicTranslation(newPos);
            super.update(elapsedTime);
            
        }

        const rayCastResult = this._castRay(3, this.castRayDeltaAngle); 
        if(Math.abs(this.castRayDeltaAngle)<60){
            if(this.castRayDeltaAngle>=0){
                this.castRayDeltaAngle++;
            }else{
                this.castRayDeltaAngle--;
            }
        }else{
            if(this.castRayDeltaAngle>0){
                this.castRayDeltaAngle = -1;
            }else{
                
            }this.castRayDeltaAngle = 0;
        }
        if (rayCastResult.hit && rayCastResult.instance instanceof ContactBall && rayCastResult.distance && rayCastResult.distance < 1.5) {
            if(rayCastResult.instance.join(this.body as RigidBody)){
                this._ball = rayCastResult.instance;  
            }     
        }
    }
}

export type CharacterArgs = {
    speed: number,
    rotationSpeed: number
}