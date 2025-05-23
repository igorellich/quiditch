import { configureStore } from '@reduxjs/toolkit';
import pauseSlice, { PauseState } from './pauseSlice';

// Define the RootState type that includes all slices' states
export interface RootState {
  pause: PauseState;
}

const store = configureStore({
    reducer: {
      pause: pauseSlice,
    },
  });       


export default store;

// Export RootState for use in components or other parts of the app
export type AppDispatch = typeof store.dispatch;
export type RootStateType = ReturnType<typeof store.getState>;