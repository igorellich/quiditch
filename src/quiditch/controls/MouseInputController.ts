import { Actor } from "../../engine/base/Actor/Actor";
import { IActor } from "../../engine/base/Actor/IActor";
import { ITickable } from "../../engine/base/ITickable";
import { SceneManager } from "../../engine/base/SceneManager";
import { Vector2d } from "../../engine/base/Vector2d";
import { InputController } from "../../engine/controls/BaseInput";
import { GameInputActions } from "../constants";

export class MouseInputController extends InputController<GameInputActions> implements ITickable {
    private _actor: IActor;
    private _targetPoint: Vector2d;

    private _prevAngle: number;
    private _rotateAction: GameInputActions;
    private _moveAction: GameInputActions;

    private _rotateIndex: number = 1;
    constructor(actor: IActor, targetPointGetter: (e: MouseEvent | TouchEvent) => Vector2d, sceneManager: SceneManager, attackButton: HTMLElement) {
        super();
        this._actor = actor;
        sceneManager.addTickable(this);
        attackButton.addEventListener("click",(evt)=>{
            evt.preventDefault();
            evt.stopPropagation();
            this._onInputChange(GameInputActions.attack, false);
        })
        document.addEventListener('click', (e) => {
            
            this._targetPoint = targetPointGetter(e);
        })
        document.addEventListener('touchend', (e) => {
            this._targetPoint = targetPointGetter(e);
        })
       
    }

    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        const actorDirection = await this._actor?.getDirectionVector();
        if (this._targetPoint && actorDirection) {
            const actorPosion = await this._actor.getPosition();
            const tagerDirection = (new Vector2d(this._targetPoint.x - actorPosion.x,
                this._targetPoint.y - actorPosion.y)).normalize();
            const angle: number = actorDirection.angleTo(tagerDirection) * 180 / Math.PI;

            if (this._prevAngle && this._prevAngle < angle) {
                this._rotateIndex = -1 * this._rotateIndex;
            }

            this._prevAngle = angle;
            const distance = actorPosion.distanceTo(this._targetPoint);
            if (angle > 10 || distance > 3) {
                if (angle > 10 && distance > 3) {
                    const rotateAction = GameInputActions.turnRight;//this._rotateIndex == 1 ? GameInputActions.turnRight : GameInputActions.turnLeft;
                    if (this._rotateAction !== rotateAction) {

                        this._onInputChange(rotateAction, true);
                        this._rotateAction = rotateAction;
                    }

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
        }
    }

}