import * as React from 'react';
import { useEffect, useState } from 'react';
import { MainMenu } from './menu/MainMenu';
import { SceneComponent } from './scene/SceneComponent';
import { BaseState } from '@common/BaseState';
import { MatchState } from '../../common/MatchState';
import { createContext } from 'react';
import { SceneController } from '../../client/game/SceneController';
export const SceneControllerContext = createContext<SceneControllerContextType|null>(null);
interface SceneControllerContextType{
  sceneController?:SceneController,
  setSceneController:(s?:SceneController)=>void
}
export const Game = (props: {
    savedStates: BaseState[],
    clientId: string
}) => {



    const [gameStates, setGameStates] = useState<BaseState[]>([]);
    const [sceneController, setSceneController] = useState<SceneController>();
    const [showMenu, setShowMenu] = useState(true);
    const [time, setTime] = useState(0);

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

    

    useEffect(() => {
        let newShowMenu = true;
        const matchState: MatchState = gameStates.filter(s => s.name === "match")[0] as MatchState;
        if (matchState) {
            newShowMenu = matchState.paused;
        }
        setShowMenu(newShowMenu)
    }, [gameStates])
    return <>
    <SceneControllerContext.Provider value={
        {sceneController, setSceneController}
    }>
        {showMenu ? <MainMenu
            onContinue={async () => sceneController?sceneController.setPause(false):console.log("onContinue")}
            onNew={async () => sceneController?sceneController.reset():console.log("onNew")} /> : null}
        <SceneComponent clientId={props.clientId} gameStates={props.savedStates} onStatesChange={(states) => {
            setGameStates(states)
        }
        } />
</SceneControllerContext.Provider>
    </>
}