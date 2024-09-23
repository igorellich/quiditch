import { IActor } from "../../engine/base/Actor/IActor";
import { ITickable } from "../../engine/base/ITickable";
import { Vector2d } from "../../engine/base/Vector2d";
import { InputController } from "../../engine/controls/BaseInput";
import { GameInputActions } from "../constants";
import { ITargetPointer } from "./ITargetPointer";

export class TargetPointInputController extends InputController<GameInputActions> implements ITickable, ITargetPointer<Vector2d> {
    private _actor?: IActor;
    private _targetPoint?: Vector2d;


    private _rotateAction?: GameInputActions;
    private _moveAction?: GameInputActions;


    constructor(actor?: IActor) {
        super();
        this._actor = actor;
    }
    private _targetReached: boolean = true;
    isTargetReached(): boolean {
        return this._targetReached;
    }

    public setTargetPoint(target?: Vector2d): void {
        const oldTarget = this._targetPoint;
        this._targetPoint = target;
        if (oldTarget && !target) {
            this._targetReached = true;



            if (this._moveAction) {
                this._onInputChange(this._moveAction, false);
                this._moveAction = undefined;
            }
            if (this._rotateAction) {
                this._onInputChange(this._rotateAction, false);
                this._rotateAction = undefined;
            }
        }
    }

    attack() {
        this._onInputChange(GameInputActions.attack, false);
    }

    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        const actorDirection = await this._actor?.getDirectionVector();
        if (this._targetPoint && actorDirection) {
            const actorPosition = await this._actor?.getPosition();

            const angle = await this._actor?.getAngelToTarget(this._targetPoint); //radians


            const distance = actorPosition?.distanceTo(this._targetPoint);
            if (angle && distance) {
                if (Math.abs(angle) > Math.PI / 18 || distance > 3) {

                    // rotate
                    if (Math.abs(angle) > Math.PI / 18) {
                        this._targetReached = false;
                        const rotateAction = angle > 0 ? GameInputActions.turnLeft : GameInputActions.turnRight;
                        if (this._rotateAction !== rotateAction) {
                            this._onInputChange(rotateAction, true);
                            this._rotateAction = rotateAction;
                        }
                    } else {
                        if (this._rotateAction != null) {

                            this._onInputChange(this._rotateAction, false);
                            this._rotateAction = undefined;
                        }
                    }
                    // move                       
                    if (distance > 3) {
                        this._targetReached = false;
                        if (this._moveAction !== GameInputActions.moveForward) {

                            this._onInputChange(GameInputActions.moveForward, true);
                            this._moveAction = GameInputActions.moveForward;
                        }
                    } else {
                        if (this._moveAction != null) {

                            this._onInputChange(this._moveAction, false);
                            this._moveAction = undefined;
                        }
                    }
                } else {
                    this.setTargetPoint(undefined);
                }
            }
        } else {
            this.setTargetPoint(undefined);
        }
    }

}