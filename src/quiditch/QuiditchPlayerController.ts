import { ActorController } from "../engine/controls/ActorController";
import { InputController } from "../engine/controls/BaseInput";
import { GameInputActions as QuiditchInputActions } from "./constants";
import { IActor } from "../engine/base/Actor/IActor";

export class QuiditchPlayerController extends ActorController<QuiditchInputActions, IActor>{
    
    

    private _moving: QuiditchInputActions.moveForward|QuiditchInputActions.moveBackward|null = null;

  
    private _rotating: QuiditchInputActions.turnLeft|QuiditchInputActions.turnRight|null = null;

    //private _characterController: KinematicCharacterController;
    constructor(actor: IActor, inputController: InputController<QuiditchInputActions>) {
        super(actor, inputController);
        this._actor = actor;
        //this._characterController = world.createCharacterController(0.1);
    }
    protected async _applyAction(actionType: QuiditchInputActions, started?: boolean | undefined): Promise<void> {
        
       
        switch (actionType) {

            case QuiditchInputActions.moveForward:
                this._moving = started?actionType:null;
                
                break;
            case QuiditchInputActions.moveBackward:
                this._moving = started?actionType:null;
                break;
            case QuiditchInputActions.turnLeft:
                this._rotating = started?actionType:null;
                break;
            case QuiditchInputActions.turnRight:
                this._rotating = started?actionType:null;
                break;


        }
       
    }
    public async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        //const body = (this._actor as MFActor).getBody() as RapierBasedBody;
        //const collider = body.getRigidBody().collider(0);
        //if (body && this._characterController && collider) {
        //if (this._characterController) {
            const rotatingRight = this._rotating ? this._rotating === QuiditchInputActions.turnLeft ? false : true : null;
            if (rotatingRight !== null) {
                this._actor.rotate(rotatingRight, deltaTime);
            }
            
            //const rigidBody = body.getRigidBody();
            const movingBackward = this._moving?this._moving===QuiditchInputActions.moveForward?false:true:null;
            if(movingBackward!==null){
                this._actor.move(movingBackward,deltaTime);
            }
           
            
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
        //}
    }
}