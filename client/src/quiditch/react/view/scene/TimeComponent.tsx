import * as React from 'react'

const style:React.CSSProperties = {
    textAlign:"center",
    width: "100%",
    display: "block",
    zIndex: 2,
    position: "absolute"
}
export const TimeComponent=(props:{
    time:number,
    duration: number
})=>{
    const timeLeft = Math.round((props.duration*1000 - props.time)/1000);
    const minutesLeft = Math.floor(timeLeft/60);
    const secondsLeft = timeLeft - minutesLeft*60;
    return <label style={style} >{minutesLeft}:{secondsLeft}</label>
}