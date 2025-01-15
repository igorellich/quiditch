import * as React from "react"
import { Ref } from "react"

export const CanvasComponent=(props:{canvasRef:Ref<HTMLCanvasElement>})=>{
    return <canvas ref={props.canvasRef}></canvas>
}