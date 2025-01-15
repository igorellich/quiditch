import {KeyboardInputMap } from "@common/quiditch/constants";
import { InputController } from "../../engine/controls/BaseInput";

export class KeyboardInputController<TGameActions> extends InputController<TGameActions> {

    constructor(keyboardInputMap: KeyboardInputMap) {
        super();
        document.addEventListener('keydown', (e) => {

            const action = Object.keys(keyboardInputMap).filter(a => keyboardInputMap[a as keyof KeyboardInputMap].keys.includes(e.key))[0];
            const actionDesc = keyboardInputMap[action as keyof KeyboardInputMap];
            if (!actionDesc.single) {
                this._onInputChange(action as unknown as TGameActions, true);
            }
        })

        document.addEventListener('keyup', (e) => {

            const action = Object.keys(keyboardInputMap).filter(a => keyboardInputMap[a as keyof KeyboardInputMap].keys.includes(e.key))[0];

            const actionDesc = keyboardInputMap[action as keyof KeyboardInputMap];
            this._onInputChange(action as unknown as TGameActions, actionDesc.single ? true : false);
        })
    }
}
