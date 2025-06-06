import { BaseState } from '@common/BaseState';
import { createSlice } from '@reduxjs/toolkit';

export interface GameSlice {
    gameStates: BaseState[];
    reseting:boolean;
    duration: number;
}
const currStatesStr = window.localStorage.getItem("quiditchStates");
const currStates: BaseState[] = currStatesStr && currStatesStr != "undefined" ? JSON.parse(currStatesStr) : [];
const initialState: GameSlice = {
    gameStates: currStates,
    reseting:false,
    duration: 5
};

export type TickPayload = {
    gameStates: BaseState[];
}

export const gameStatesSlice = createSlice({
    name: 'gameStates',
    initialState,
    reducers: {
        tick: (state, action) => {
            state.gameStates = (action.payload as TickPayload).gameStates; 
            
        },
        resetStarted:(state)=>{
            state.reseting = true;
        },
        resetEnded:(state)=>{
            state.reseting = false;
        }
    
    },
});
export const { tick, resetStarted, resetEnded } = gameStatesSlice.actions;

export const gameReducer =  gameStatesSlice.reducer;