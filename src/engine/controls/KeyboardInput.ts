import { GameInputActions, KeyboardInputMap } from "../../constants";
import { InputController } from "./BaseInput";


export class KeyboardInputController extends InputController<GameInputActions>{

    constructor(keyboardInputMap: KeyboardInputMap) {
        super();
        document.addEventListener('keydown', (e) => {
            
            const action = Object.keys(keyboardInputMap).filter(a => keyboardInputMap[a as keyof KeyboardInputMap].includes(e.key))[0];
            if (action) {
                this._onInputChange(action as unknown as GameInputActions, true)
            }
        })

        document.addEventListener('keyup', (e) => {
            const action = Object.keys(keyboardInputMap).filter(a => keyboardInputMap[a as keyof KeyboardInputMap].includes(e.key))[0];

            if (action) {
                this._onInputChange(action as unknown as GameInputActions, false)
            }
        })
    }
}
