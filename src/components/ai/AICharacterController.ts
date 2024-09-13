
import { Vector2 } from "three";
import { InstanceStore } from "../store/InstanceStore";
import SimpleScene from "../SimpleScene";
import { BaseBall } from "../balls/BaseBall";
import { Character, CharacterArgs } from "../character/Character";

export class AICharacterController {
    private _ball: BaseBall | undefined;
    private _character: Character;
    private readonly _store: InstanceStore;
    private readonly _basecharArgs: CharacterArgs
    constructor(character: Character, store: InstanceStore, scene: SimpleScene, basecharArgs: CharacterArgs) {
        this._character = character
        this._store = store;
        this._basecharArgs = basecharArgs
        scene.addUpdateHandler(() => {
            this.update();
        })
    }
    private _prevAngle: number | undefined
    private _rotateIndex: number = 1;
    public update() {
        if (!this._character.hasBall()) {
            this._ball = this._store.getInstancesByType(BaseBall)[0] as BaseBall;

            const charDirection = this._character.getDirectionVector();


            const ballTranslation = this._ball.body?.translation()
           
            if (ballTranslation && charDirection && this._character.body) {
                //const vectorToBall = charDirection.
                const angle: number = charDirection.angleTo((new Vector2(ballTranslation.x - this._character.body?.translation().x, ballTranslation.y - this._character.body?.translation().y)).normalize() )* 180 / Math.PI;

                if (this._prevAngle && this._prevAngle < angle) {
                    this._rotateIndex = -1 * this._rotateIndex;
                }

                this._prevAngle = angle;
                
                if (angle > 4) {
                    //this._character.setSpeed(0);
                    this._character.setRotationSpeed(this._basecharArgs.rotationSpeed * this._rotateIndex);
                } else {
                    this._character.setRotationSpeed(0);
                    const charPosition  = new Vector2(this._character.body?.translation().x,this._character.body?.translation().y)
                    const distance = charPosition.distanceTo(ballTranslation);
                    
                    if (distance > 0.5) {
                        this._character.setSpeed(this._basecharArgs.speed);
                    } else {
                        this._character.setSpeed(0);
                    }
                }

            }

        }else{
            this._character.setSpeed(0);
            this._character.setRotationSpeed(0);
        }
    }

}