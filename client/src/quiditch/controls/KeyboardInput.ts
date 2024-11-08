import { GameInputActions, KeyboardInputMap } from "@common/quiditch/constants";
import { InputController } from "../../engine/controls/BaseInput";

export class KeyboardInputController<TGameActions> extends InputController<GameInputActions> {

    constructor(keyboardInputMap: KeyboardInputMap) {
        super();
        document.addEventListener('keydown', (e) => {

            const action = Object.keys(keyboardInputMap).filter(a => keyboardInputMap[a as keyof KeyboardInputMap].keys.includes(e.key))[0];
            const actionDesc = keyboardInputMap[action as keyof KeyboardInputMap];
            if (!actionDesc.single) {
                this._onInputChange(action as unknown as GameInputActions, true);
            }
        })

        document.addEventListener('keyup', (e) => {

            const action = Object.keys(keyboardInputMap).filter(a => keyboardInputMap[a as keyof KeyboardInputMap].keys.includes(e.key))[0];

            const actionDesc = keyboardInputMap[action as keyof KeyboardInputMap];
            this._onInputChange(action as unknown as GameInputActions, actionDesc.single ? true : false);
        })
    }
}
