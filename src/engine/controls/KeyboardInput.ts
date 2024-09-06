import { BaseInput } from "./BaseInput";


export class KeyboardInput extends BaseInput<GameInputActions>{
   
   constructor(){
       super();
       document.addEventListener('keydown', (e) => {
        if (e.key === 'a') {
          
          this._onInputChange(GameInputActions.turnLeft,true);
        }
        if (e.key === 'd') {
            this._onInputChange(GameInputActions.turnRight,true);
        }
        if (e.key === 'w') {
            this._onInputChange(GameInputActions.moveForward,true);
        }
        if (e.key === 's') {
            this._onInputChange(GameInputActions.moveBackward,true);
        }
      })
      document.addEventListener('keyup', (e) => {
        if (e.key === 'a' || e.key === 'd') {
            this._onInputChange(GameInputActions.turnLeft,false);
            this._onInputChange(GameInputActions.turnRight,false);
        }
        if (e.key === 'w' || e.key === 's') {
            this._onInputChange(GameInputActions.moveForward,false);
            this._onInputChange(GameInputActions.moveBackward,false);
        }
      })
   }
    
    

}
export enum GameInputActions{
    "moveForward",
    'moveBackward',
    'turnLeft',
    'turnRight',
    'attack'
}