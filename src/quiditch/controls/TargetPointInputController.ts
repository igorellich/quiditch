import { IActor } from "../../engine/base/Actor/IActor";
import { ITickable } from "../../engine/base/ITickable";
import { Vector2d } from "../../engine/base/Vector2d";
import { InputController } from "../../engine/controls/BaseInput";
import { GameInputActions } from "../constants";
import { ITargetPointer } from "./ITargetPointer";

export class TargetPointInputController extends InputController<GameInputActions> implements ITickable, ITargetPointer<Vector2d> {
    private _actor: IActor;
    private _targetPoint?: Vector2d;


    private _rotateAction?: GameInputActions;
    private _moveAction?: GameInputActions;


    constructor(actor: IActor) {
        super();
        this._actor = actor;
    }
    getActor(): IActor {
        return this._actor;
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

            this.setTargetAngle(0)

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
    private _targetAngle?:number;
    public setTargetAngle(angle: number){
        this._targetAngle = angle;
    }

    attack() {
        this._onInputChange(GameInputActions.attack, false);
    }

    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        const actorDirection = await this._actor?.getDirectionVector();
        if (this._targetPoint && actorDirection) {
            const actorPosition = await this._actor?.getPosition();

            const angle = await this._actor?.getAngelToTarget(this._targetPoint); //radians
            this.setTargetAngle(angle);

            const distance = actorPosition?.distanceTo(this._targetPoint);

            if (distance > 3 || (this._targetAngle && this._targetAngle > 0)) {

                this._targetReached = false;
                // move                       
                if (distance > 3) {
                    
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
        
        // rotate
        if (this._targetAngle && Math.abs(this._targetAngle) > 0) {
            if (Math.abs(this._targetAngle) > Math.PI / 18) {
                const rotateAction = this._targetAngle > 0 ? GameInputActions.turnLeft : GameInputActions.turnRight;
                if (this._rotateAction !== rotateAction) {
                    this._onInputChange(rotateAction, true);
                    this._rotateAction = rotateAction;
                }
            } else {
                if(this._rotateAction){
                this._onInputChange(this._rotateAction, false);
                this._rotateAction = undefined;
                }
                const actorRotation = await this._actor.getRotation();
                await this._actor.setRotation(actorRotation + this._targetAngle);
                // console.log( await this._actor.getRotation(), actorRotation + this._targetAngle);
            }

        }
    }

}