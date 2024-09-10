import { KinematicCharacterController, QueryFilterFlags, Vector2, World } from "@dimforge/rapier2d";
import { MFActor } from "../../../engine/MF/MFActor";
import { Actor } from "../../../engine/base/Actor";
import { ActorController } from "../../../engine/controls/ActorController";
import { InputController } from "../../../engine/controls/BaseInput";
import { GameInputActions as QuiditchInputActions } from "../../constants";
import { RapierBasedBody } from "../../../engine/MF/rapier/RapierBasedBody";

export class RapierPlayerController extends ActorController<QuiditchInputActions, Actor>{
    
    protected _actor: MFActor;

    private _speed: number = 0;

  
    private _rotationSpeed: number = 0;

    private _characterController: KinematicCharacterController;
    constructor(actor: MFActor, inputController: InputController<QuiditchInputActions>, world: World) {
        super(actor, inputController);
        this._actor = actor;
        this._characterController = world.createCharacterController(0.1);
    }
    protected async _applyAction(actionType: QuiditchInputActions, started?: boolean | undefined): Promise<void> {
        
       
        switch (actionType) {

            case QuiditchInputActions.moveForward:
                this._speed = started ? this._actor.getSpeed() : 0;
                
                break;
            case QuiditchInputActions.moveBackward:
                this._speed = started ? -this._actor.getSpeed() : 0;
                break;
            case QuiditchInputActions.turnLeft:
                this._rotationSpeed = started ? -this._actor.getRotationSpeed() : 0;
                break;
            case QuiditchInputActions.turnRight:
                this._rotationSpeed = started ? this._actor.getRotationSpeed() : 0;
                break;


        }
       
    }
    public async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        const body = this._actor.getBody() as RapierBasedBody;
        const collider = body.getRigidBody().collider(0);
        if (body && this._characterController && collider) {
            const newRotation = await this._actor.getRotation() + this._rotationSpeed;
            await body.setRotation(newRotation);
            const rigidBody = body.getRigidBody();
            const directionVector = new Vector2(
                -Math.sin(await body.getRotation()) * this._speed * rigidBody.mass()*10,
                Math.cos(await body.getRotation()) * this._speed* rigidBody.mass()*10
            )
            rigidBody.setLinearDamping(10)
           
            rigidBody.applyImpulse(directionVector,true);
            
            // this._characterController.computeColliderMovement(collider,
            //     directionVector,
            //     QueryFilterFlags.EXCLUDE_SENSORS,
            //     //this._filterGroups
            // );

            // const movement = this._characterController.computedMovement();
            // this._characterController.setApplyImpulsesToDynamicBodies(true)
            // const newPos = await body.getPosition();
            // newPos.x += movement.x;
            // newPos.y += movement.y;
            // this._actor.setPosition(newPos.x, newPos.y);
        }
    }
}