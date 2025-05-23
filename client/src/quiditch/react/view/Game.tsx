import * as React from 'react';
import { useEffect, useState } from 'react';
import { MainMenu } from './menu/MainMenu';
import { SceneComponent } from './scene/SceneComponent';
import { BaseState } from '@common/BaseState';
import { MatchState } from '../../common/MatchState';
import { createContext } from 'react';
import { SceneController } from '../../client/game/SceneController';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
export const SceneControllerContext = createContext<SceneControllerContextType|null>(null);
interface SceneControllerContextType{
  sceneController?:SceneController,
  setSceneController:(s?:SceneController)=>void
}
export const Game = (props: {
    savedStates: BaseState[],
    clientId: string
}) => {


    const pause = useSelector((state: RootState) => state.pause);
    const [gameStates, setGameStates] = useState<BaseState[]>([]);
    const [sceneController, setSceneController] = useState<SceneController>();
    
    const [time, setTime] = useState(0);
    const sceneComponent = React.useMemo(() => <SceneComponent clientId={props.clientId} gameStates={props.savedStates} onStatesChange={(states) => {
            // setGameStates(states)
    }} />, []);
        
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
    
    return <>
    <SceneControllerContext.Provider value={
        {sceneController, setSceneController}
    }>
        {pause.isPaused ? <MainMenu
            onContinue={async () => sceneController?sceneController.setPause(false):console.log("onContinue")}
            onNew={async () => sceneController?sceneController.reset():console.log("onNew")} /> : null}
        {sceneComponent}
</SceneControllerContext.Provider>
    </>
}