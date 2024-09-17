import { IActor } from "../../engine/base/Actor/IActor";
import { ITickable } from "../../engine/base/ITickable";
import { Vector2d } from "../../engine/base/Vector2d";
import { InputController } from "../../engine/controls/BaseInput";
import { GameInputActions } from "../constants";

export class TargetPointInputController extends InputController<GameInputActions> implements ITickable {
    private _actor: IActor;
    private _targetPoint: Vector2d;

    private _prevAngle: number;
    private _rotateAction: GameInputActions;
    private _moveAction: GameInputActions;

    private _rotateIndex: number = 1;
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
            const actorPosion = await this._actor.getPosition();
            const tagerDirection = (new Vector2d(this._targetPoint.x - actorPosion.x,
                this._targetPoint.y - actorPosion.y)).normalize();
            const atan1 = Math.atan2(actorDirection.y, actorDirection.x);
            const atan2 = Math.atan2(tagerDirection.y, tagerDirection.x);
            let angle: number = (atan2 - atan1) * 180 / Math.PI;//actorDirection.angleTo(tagerDirection) * 180 / Math.PI;
            if (Math.abs(angle) > 180) {
                angle = angle > 0 ? 360 - angle : 360 + angle;
                if (angle > 360) {
                    angle -= 360;
                }
                if (angle < -360) {
                    angle += 360;
                }
            }


            this._prevAngle = angle;
            const distance = actorPosion.distanceTo(this._targetPoint);
            if (Math.abs(angle) > 10 || distance > 3) {
                if (Math.abs(angle) > 10 && distance > 3) {
                    const rotateAction = angle > 0 ? GameInputActions.turnLeft : GameInputActions.turnRight; //this._rotateIndex == 1 ? GameInputActions.turnRight : GameInputActions.turnLeft;
                    if (this._rotateAction !== rotateAction) {
                        if (this._rotateAction != null) {
                            this._onInputChange(rotateAction, false);
                        }

                    }
                    // if (this._moveAction) {
                    //     this._onInputChange(GameInputActions.moveForward, false);
                    // }
                    this._onInputChange(rotateAction, true);
                    console.log(rotateAction)
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