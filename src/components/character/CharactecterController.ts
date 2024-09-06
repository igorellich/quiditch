import { GameInputActions } from "../../constants";
import { InputController } from "../../engine/controls/BaseInput";

import { Character, CharacterArgs } from "./Character";

export class CharacterController {
    constructor(character: Character, inputController: InputController<GameInputActions>, basecharArgs: CharacterArgs) {
        // init inputs
        inputController.addOnInputChangeHandler((action, started) => {
            try {
                switch (action) {

                    case GameInputActions.moveForward:
                       
                        character.setSpeed(started ? basecharArgs.speed : 0.0);
                        break;
                    case GameInputActions.moveBackward:
                        character.setSpeed(started ? -basecharArgs.speed : 0.0);
                        break;
                    case GameInputActions.turnLeft:
                        character.setRotationSpeed(started ? basecharArgs.rotationSpeed : 0.0);
                        break;
                    case GameInputActions.turnRight:
                        character.setRotationSpeed(started ? -basecharArgs.rotationSpeed : 0.0);
                        break;
                    case GameInputActions.attack:
                        if (started) {
                            character.attack();
                        }
                        break;
                }
            } catch (ex) {
                console.log(ex)
            }
        });
    }
}