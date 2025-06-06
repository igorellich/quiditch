import { configureStore } from '@reduxjs/toolkit';
import { PauseState, pauseReducer } from './pauseSlice';
import { gameReducer } from './gameSlice';
import { BaseState } from '@common/BaseState';
import { gameEndReducer } from './gameEndSlice';

// Define the RootState type that includes all slices' states
interface RootState {
  pause: PauseState;
  gameStates: BaseState[]
}

export const store = configureStore({
    reducer: {
      pause: pauseReducer,
      gameStates: gameReducer,
      gameEnded: gameEndReducer
    },
  });       


// Export RootState for use in components or other parts of the app
export type AppDispatch = typeof store.dispatch;
export type RootStateType = ReturnType<typeof store.getState>;