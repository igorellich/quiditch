import { useEffect, useRef, useState } from "react"
import { CanvasComponent } from "./CanvasComponent";
import * as React from "react";
import { JoyControl } from "./JoyControl";
import { AttackButton } from "./AttackButton";
import { ScoreComponent } from "./ScoreComponent";
import { SceneComponentController } from "../../../client/game/SceneComponentController";
import { BaseState } from "@common/BaseState";

export const SceneComponent = (props: {
   onStatesChange:(states:BaseState[])=>void,
   gameStates:BaseState[]
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sceneComponentController,setSceneComponentController]=useState<SceneComponentController>()

  
   
    useEffect(() => {
        if(canvasRef.current){
            setSceneComponentController(new SceneComponentController(canvasRef.current as HTMLCanvasElement, undefined, props.onStatesChange, props.gameStates));
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