import { GameInputActions, KeyboardInputMap } from "../../quiditch/constants";
import { IActor } from "../base/Actor/IActor";
import { ActorController } from "./ActorController";
import { InputController } from "./BaseInput";


export class KeyboardInputController<TGameActions> extends InputController<GameInputActions>{

    constructor(keyboardInputMap: KeyboardInputMap, actorController:ActorController<TGameActions,IActor>) {
        super();
        document.addEventListener('keydown', (e) => {
            
            const action = Object.keys(keyboardInputMap).filter(a => keyboardInputMap[a as keyof KeyboardInputMap].includes(e.key))[0];
            if (action) {
                actorController.applyAction(action as unknown as TGameActions, true)
            }
        })

        document.addEventListener('keyup', (e) => {
            const action = Object.keys(keyboardInputMap).filter(a => keyboardInputMap[a as keyof KeyboardInputMap].includes(e.key))[0];

            if (action) {
                actorController.applyAction(action as unknown as TGameActions, false)
            }
        })
    }
}
