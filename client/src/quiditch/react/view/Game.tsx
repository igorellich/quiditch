import * as React from 'react';
import { useEffect, useState } from 'react';
import { MainMenu } from './menu/MainMenu';
import { SceneComponent } from './scene/SceneComponent';
import { BaseState } from '@common/BaseState';
import { MatchState } from '../../common/MatchState';

export const Game = () => {
    const [gameStates, setGameStates] = useState([] as BaseState[]);
    const [showMenu, setShowMenu] = useState(true);
    useEffect(()=>{
        let newShowMenu = true;
        const matchSatae:MatchState = gameStates.filter(s=>s.name==="match")[0] as MatchState;
        if(matchSatae){
            newShowMenu = matchSatae.paused;
        }
        setShowMenu(newShowMenu)
    }, gameStates)
    return <>
        {showMenu ? <MainMenu /> : null}
        <SceneComponent onStatesChange={(states)=>{           
            setGameStates(states)
            }
             }/>

    </>
}