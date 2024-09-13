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

    private _rotateIndex: number = 1;
    constructor(actor: IActor, targetPointGetter: (e: MouseEvent) => Vector2d, sceneManager: SceneManager) {
        super();
        this._actor = actor;
        sceneManager.addTickable(this);
        document.addEventListener('click', (e) => {
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

            if (angle > 4) {
                this._onInputChange(this._rotateIndex == 1 ? GameInputActions.turnRight : GameInputActions.turnLeft, true);

            } else {
                this._onInputChange(this._rotateIndex == 1 ? GameInputActions.turnRight : GameInputActions.turnLeft, false);


                const distance = actorPosion.distanceTo(this._targetPoint);

                if (distance > 0.5) {
                    this._onInputChange(GameInputActions.moveForward, true);
                } else {
                    this._onInputChange(GameInputActions.moveForward, false);
                }
            }

        }
    }

}