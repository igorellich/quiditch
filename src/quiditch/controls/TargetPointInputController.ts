import { IActor } from "../../engine/base/Actor/IActor";
import { ITickable } from "../../engine/base/ITickable";
import { Vector2d } from "../../engine/base/Vector2d";
import { ActorController } from "../../engine/controls/ActorController";
import { GameInputActions } from "../constants";
import { ITargetPointer } from "./ITargetPointer";

export class TargetPointInputController implements ITickable, ITargetPointer<Vector2d, GameInputActions, IActor> {
    private _targetPoint?: Vector2d;


    private _rotateAction?: GameInputActions;
    private _moveAction?: GameInputActions;

    private readonly _actorController: ActorController<GameInputActions, IActor>;

    constructor(actorController: ActorController<GameInputActions, IActor>) {
        this._actorController = actorController;

    }
    getActorController(): ActorController<GameInputActions, IActor> {
        return this._actorController;
    }
    getActor(): IActor {
        return this._actorController.getActor();
    }
    private _targetReached: boolean = true;
    isTargetReached(): boolean {
        return this._targetReached;
    }

    public async setTargetPoint(target?: Vector2d): Promise<void> {
        const oldTarget = this._targetPoint;
        this._targetPoint = target;
        if (oldTarget && !target) {
            this._targetReached = true;
            this.setTargetAngle(0)
        }
    }
    private _targetAngle?: number;
    public setTargetAngle(angle: number) {
        this._targetAngle = angle;
    }

    async attack() {
        await this._actorController.applyAction(GameInputActions.attack, false);
    }

    async tick(elapsedTime: number, deltaTime: number): Promise<void> {



        const actor = this._actorController.getActor();
        const actorDirection = await actor.getDirectionVector();
        if (this._targetPoint && actorDirection) {
            const actorPosition = await actor.getPosition();

            const angle = await actor.getAngelToTarget(this._targetPoint); //radians
            this.setTargetAngle(angle);

            const distance = actorPosition?.distanceTo(this._targetPoint);

            if (distance > 0 || (this._targetAngle && this._targetAngle > 0)) {

                this._targetReached = false;
                // move                       
                if (distance > 0.5) {

                    if (this._moveAction !== GameInputActions.moveForward) {

                        await this._actorController.applyAction(GameInputActions.moveForward, true);
                        this._moveAction = GameInputActions.moveForward;
                    }
                } else {
                    if (this._moveAction != null) {

                        await this._actorController.applyAction(this._moveAction, false);
                        this._moveAction = undefined;
                    }

                    await actor.setPosition(this._targetPoint.x, this._targetPoint.y);
                }
            } else {
                await this.setTargetPoint(undefined);
            }

        } else {
            if (this._moveAction != null) {

                await this._actorController.applyAction(this._moveAction, false);
                this._moveAction = undefined;
            }
        }

        // rotate
        if (this._targetAngle && Math.abs(this._targetAngle) > 0) {
            if (Math.abs(this._targetAngle) > Math.PI / 18) {
                const rotateAction = this._targetAngle > 0 ? GameInputActions.turnLeft : GameInputActions.turnRight;
                if (this._rotateAction !== rotateAction) {
                    await this._actorController.applyAction(rotateAction, true);
                    this._rotateAction = rotateAction;
                }
            } else {
                if (this._rotateAction) {
                    await this._actorController.applyAction(this._rotateAction, false);
                    this._rotateAction = undefined;
                }
                const actorRotation = await actor.getRotation();
                await actor.setRotation(actorRotation + this._targetAngle);
                // console.log( await this._actor.getRotation(), actorRotation + this._targetAngle);
            }

        } else {
            if (this._rotateAction) {
                await this._actorController.applyAction(this._rotateAction, false);
                this._rotateAction = undefined;
            }
        }

    }

}