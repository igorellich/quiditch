import * as React from 'react';
import { useEffect, useState } from 'react';
import { MainMenu } from './menu/MainMenu';
import { SceneComponent } from './scene/SceneComponent';
import { BaseState } from '@common/BaseState';
import { MatchState } from '../../common/MatchState';
const currStatesStr = window.localStorage.getItem("quiditchStates");
let currStates: BaseState[] = currStatesStr && currStatesStr != "undefined" ? JSON.parse(currStatesStr) : [];
export const Game = () => {



    const [gameStates, setGameStates] = useState(currStates as BaseState[]);
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
        {showMenu ? <MainMenu /> : null}
        <SceneComponent gameStates={gameStates} onStatesChange={(states) => {
            setGameStates(states)
        }
        } />

    </>
}