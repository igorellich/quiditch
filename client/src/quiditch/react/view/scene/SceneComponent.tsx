import { useContext, useEffect, useRef, useState } from "react"
import { CanvasComponent } from "./CanvasComponent";
import * as React from "react";
import { JoyControl } from "./JoyControl";
import { AttackButton } from "./AttackButton";
import { ScoreComponent } from "./ScoreComponent";
import { SceneController } from "../../../client/game/SceneController";
import { BaseState } from "@common/BaseState";
import { SceneControllerContext } from "../Game";


export const SceneComponent = (props: {
   onStatesChange:(states:BaseState[])=>void,
   gameStates:BaseState[],
   clientId: string
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sceneComponentController,setSceneComponentController]=useState<SceneController>()
    const sceneControllerContext = useContext(SceneControllerContext)
  
   
    useEffect(() => {
        if(canvasRef.current){
            const onInit = () => {
                if (sceneControllerContext) {
                    sceneControllerContext.setSceneController(sceneController);
                }
            }
            const sceneController = new SceneController(canvasRef.current as HTMLCanvasElement, props.clientId, onInit, props.onStatesChange, props.gameStates);
            setSceneComponentController(sceneComponentController);
           
        }
    }, [])
    const attackHandle=React.useCallback((evt:any)=>{
        sceneComponentController?.attack();
        evt.preventDefault();
        evt.stopPropagation();
    },[sceneComponentController] )
    return <><CanvasComponent canvasRef={canvasRef}></CanvasComponent>
    {sceneComponentController?(
        <>
        <JoyControl onEndMove={()=>sceneComponentController.stopMoving()} onStartMove={(x,y)=>sceneComponentController.startMoving(x,y)}></JoyControl>
        <AttackButton callback={attackHandle}></AttackButton>
        <ScoreComponent matchStateGetter={()=>sceneComponentController.getMatchState()}></ScoreComponent> </>):null}
    </>
}