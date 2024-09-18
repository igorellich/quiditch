import { IActor } from "../../engine/base/Actor/IActor";
import { ITickable } from "../../engine/base/ITickable";
import { Vector2d } from "../../engine/base/Vector2d";
import { InputController } from "../../engine/controls/BaseInput";
import { GameInputActions } from "../constants";

export class TargetPointInputController extends InputController<GameInputActions> implements ITickable {
    private _actor: IActor;
    private _targetPoint: Vector2d;

  
    private _rotateAction: GameInputActions;
    private _moveAction: GameInputActions;

   
    constructor(actor?: IActor) {
        super();
        this._actor = actor;
    }

    public setTargerPoint(target: Vector2d) {
        this._targetPoint = target;
    }

    attack() {
        this._onInputChange(GameInputActions.attack, false);
    }

    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        const actorDirection = await this._actor?.getDirectionVector();
        if (this._targetPoint && actorDirection) {
            const actorPosition = await this._actor.getPosition();
                      
            const angle = await this._actor.getAngelToTarget(this._targetPoint); //radians

            
            const distance = actorPosition.distanceTo(this._targetPoint);
            if (Math.abs(angle) > Math.PI/18 || distance > 3) {
                if (Math.abs(angle) > Math.PI/18 && distance > 3) {
                    const rotateAction = angle > 0 ? GameInputActions.turnLeft : GameInputActions.turnRight; 
                    if (this._rotateAction !== rotateAction) {
                        if (this._rotateAction != null) {
                            this._onInputChange(rotateAction, false);
                        }

                    }
                    if (this._moveAction) {
                        this._onInputChange(GameInputActions.moveForward, false);
                    }
                    this._onInputChange(rotateAction, true);
                    // console.log(angle*180/Math.PI, rotateAction)
                    this._rotateAction = rotateAction;

                } else {
                    if (this._rotateAction) {
                        this._onInputChange(this._rotateAction, false);

                        this._rotateAction = null;
                    }


                    if (distance > 3 && this._moveAction !== GameInputActions.moveForward) {

                        this._onInputChange(GameInputActions.moveForward, true);
                        this._moveAction = GameInputActions.moveForward;
                    } else {
                        if (this._moveAction) {
                            this._onInputChange(this._moveAction, false);
                            this._moveAction = null;
                        }
                    }
                }
            } else {
                if (this._moveAction) {
                    this._onInputChange(this._moveAction, false);
                    this._moveAction = null;
                }
                if (this._rotateAction) {
                    this._onInputChange(this._rotateAction, false);
                    this._rotateAction = null;
                }
                this._targetPoint = null;
            }
        } else {
            if (this._moveAction) {
                this._onInputChange(this._moveAction, false);
                this._moveAction = null;
            }
            if (this._rotateAction) {
                this._onInputChange(this._rotateAction, false);
                this._rotateAction = null;
            }
        }
    }

}