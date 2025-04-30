import { useEffect, useRef, useState } from "react"
import { CanvasComponent } from "./CanvasComponent";
import * as React from "react";
import { JoyControl } from "./JoyControl";
import { AttackButton } from "./AttackButton";
import { ScoreComponent } from "./ScoreComponent";
import { SceneComponentController } from "../../client/game/SceneComponentController";

export const SceneComponent = (props: {
   
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sceneComponentController,setSceneComponentController]=useState<SceneComponentController>()

  
   
    useEffect(() => {
        if(canvasRef.current){
            setSceneComponentController(new SceneComponentController(canvasRef.current as HTMLCanvasElement));
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
        <JoyControl onEndMove={sceneComponentController.stopMoving} onStartMove={sceneComponentController.startMoving}></JoyControl>
        <AttackButton callback={attackHandle}></AttackButton>
        <ScoreComponent matchStateGetter={()=>sceneComponentController.getMatchState()}></ScoreComponent> </>):null}
    </>
}