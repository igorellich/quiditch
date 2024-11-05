import { GameInputActions, KeyboardInputMap } from "../../quiditch/constants";
import { InputController } from "./BaseInput";


    export class KeyboardInputController<TGameActions> extends InputController<GameInputActions> {

        constructor(keyboardInputMap: KeyboardInputMap) {
            super();
            document.addEventListener('keydown', (e) => {
                //if ((actorController.getActor() as PlayerActor)?.getIsControlled()) {
                    const action = Object.keys(keyboardInputMap).filter(a => keyboardInputMap[a as keyof KeyboardInputMap].includes(e.key))[0];
                    if (action) {
                        //actorController.applyAction(action as unknown as TGameActions, true)
                        this._onInputChange(action as unknown as GameInputActions, true);
                    }
                //}
            })

            document.addEventListener('keyup', (e) => {
                //if ((actorController.getActor() as PlayerActor)?.getIsControlled()) {
                    const action = Object.keys(keyboardInputMap).filter(a => keyboardInputMap[a as keyof KeyboardInputMap].includes(e.key))[0];

                    if (action) {
                        //actorController.applyAction(action as unknown as TGameActions, false)
                        this._onInputChange(action as unknown as GameInputActions, false);
                    }
                //}
            })
    }
}
