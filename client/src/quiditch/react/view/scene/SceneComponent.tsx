import { useEffect, useRef, useState } from "react"
import { CanvasComponent } from "./CanvasComponent";
import * as React from "react";
import { JoyControl } from "./JoyControl";
import { AttackButton } from "./AttackButton";
import { ScoreComponent } from "./ScoreComponent";
import { BaseState } from "@common/BaseState";

import { TimeComponent } from "./TimeComponent";
import { useDispatch } from "react-redux";
import { tick } from "../../store/gameSlice";
import { startPause, stopPause } from "../../store/pauseSlice";
import { useSelector } from "react-redux";
import { RootStateType } from "../../store/store";
import { resetEnded } from "../../store/gameSlice";
import { MatchState } from "../../../common/MatchState";
import { useSceneController } from "./useSceneControler";
import { setGameEnd } from "../../store/gameEndSlice";

export const SceneComponent = (props: {
    gameStates: BaseState[],
    clientId: string
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const stateChangeHandler = React.useCallback((states: BaseState[]) => {
        const payload = { gameStates: states.map(s=>{return {...s}}) };
        dispatch(tick(payload));
    }, [])

    const sceneComponentController = useSceneController(canvasRef as React.RefObject<HTMLCanvasElement>, stateChangeHandler, props.clientId, props.gameStates);
    const duration = useSelector((s: RootStateType) => s.gameStates.duration);
    const [time, setTime] = useState<number>(0);
    const dispatch = useDispatch();

    const gameStates = useSelector((s: RootStateType) => s.gameStates.gameStates);
    useEffect(() => {
        const matchState: MatchState = gameStates.filter(s => s.name === "match")[0] as MatchState;
        if (matchState && matchState.paused !== pause) {
            dispatch(matchState.paused ? startPause() : stopPause());            
        }
        setTime(matchState.time);
    }, [gameStates])
    const pause = useSelector((s: RootStateType) => s.pause.isPaused);
    useEffect(() => {

        if (duration && time / 1000 >= duration) {
            sceneComponentController?.setPause(true);
            dispatch(setGameEnd(true))
        } else {
            sceneComponentController?.setPause(pause);
        }
    }, [pause, time])

    const reseting = useSelector((s: RootStateType) => s.gameStates.reseting);

    useEffect(() => {
        if (reseting) {
            dispatch(resetEnded());
            sceneComponentController?.reset(duration).then(() => {
                dispatch(startPause());
            });
        }
    }, [reseting]);

    const attackHandle = React.useCallback((evt: any) => {
        sceneComponentController?.attack();
        evt.preventDefault();
        evt.stopPropagation();
    }, [sceneComponentController])
    return <><CanvasComponent canvasRef={canvasRef}></CanvasComponent>
        {sceneComponentController ? (
            <>
                <JoyControl onEndMove={() => sceneComponentController.stopMoving()} onStartMove={(x, y) => sceneComponentController.startMoving(x, y)}></JoyControl>
                <AttackButton callback={attackHandle}></AttackButton>
                <ScoreComponent matchStateGetter={() => sceneComponentController.getMatchState()}></ScoreComponent> </>) : null}
        <TimeComponent duration={duration} time={time} />
    </>
}