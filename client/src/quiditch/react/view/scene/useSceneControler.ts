import { BaseState } from "@common/BaseState";
import {  RefObject, useEffect, useState } from "react";
import { SceneController } from "../../../client/game/SceneController";

    export const useSceneController = (canvasRef:RefObject<HTMLCanvasElement>, stateChangeHandler: (states:BaseState[])=>void,clientId:string, savedStates?: BaseState[])=>{
        const [sceneComponentController, setSceneComponentController] = useState<SceneController>()
        useEffect(() => {
        if (canvasRef && canvasRef.current) {

            // const stateChangeHandler = (states: BaseState[]) => {

            //     const payload = { gameStates: states };
            //     dispatch(tick(payload));

            // }
           
            const sceneController = new SceneController(canvasRef.current as HTMLCanvasElement, clientId, stateChangeHandler, savedStates);
            setSceneComponentController(sceneController);

        }
    }, [])
    return sceneComponentController;
}