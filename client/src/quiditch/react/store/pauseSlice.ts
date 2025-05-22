import { createSlice } from '@reduxjs/toolkit';

export interface PauseState {
  isPaused: boolean;
}

const initialState: PauseState = {
  isPaused: false,
};

export const pauseSlice = createSlice({
  name: 'pause',
  initialState,
  reducers: {
  startPause: (state) => {
    state.isPaused = true;
  },
    stopPause: (state) => {
      state.isPaused = false;
  },
  },
});
export const { startPause, stopPause } = pauseSlice.actions;

export default pauseSlice.reducer;
