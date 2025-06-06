import { createSlice } from "@reduxjs/toolkit";
export interface GameEndInterface{
    gameEnded: boolean;
}
const initialState:GameEndInterface={
    gameEnded:false
}
const gameEndSlice = createSlice({
    name:"gameEnd",
    initialState,
    reducers:{
        setGameEnd:(state:GameEndInterface, action)=>{
            state.gameEnded = action.payload;
        }
    }
})

export const {setGameEnd} = gameEndSlice.actions;
export const gameEndReducer = gameEndSlice.reducer;