import * as React from 'react';
import { useEffect, useState } from 'react';
import { MainMenu } from './menu/MainMenu';
import { SceneComponent } from './scene/SceneComponent';
import { useSelector } from 'react-redux';
import { RootStateType } from '../store/store';
import { useDispatch } from 'react-redux';
import { stopPause } from '../store/pauseSlice';
import { resetStarted } from "../store/gameSlice"
import { GameoverComponent } from './scene/GameoverComponent';


export const Game = (props: {
    clientId: string
}) => {

    const dispatch = useDispatch();
    const onContinue = React.useCallback(async () => {
        dispatch(stopPause());
    }, [])
    const onNew = React.useCallback(() => {
        dispatch(resetStarted())
    }, [])
    const pause = useSelector((state: RootStateType) =>{ 
        
        return state.pause.isPaused});
    useEffect(() => {
        setShowMenu(pause);
    }, [pause]);
    const [showMenu, setShowMenu] = useState(true);
    const [time, setTime] = useState(0);
    const gameStates = useSelector((state: RootStateType) => state.gameStates.gameStates)
    useEffect(() => {

        if (time >= 2000) {
            window.localStorage.setItem("quiditchStates", JSON.stringify(gameStates));
            setTime(0);
        }

    }, [time])

    useEffect(() => {
        setInterval(() => {
            setTime(time + 2000);
        }, 2000)
    }, [])

    const gameEnded = useSelector((s:RootStateType)=>s.gameEnded.gameEnded)

    return <>
        {gameEnded&&<GameoverComponent/>}
        {showMenu && <MainMenu
            onContinue={gameEnded ? undefined : onContinue}
            onNew={async () => onNew()} /> }
        <SceneComponent clientId={props.clientId} gameStates={gameStates} />

    </>
}