import * as nipplejs from "nipplejs";
import * as React from "react";
import { useEffect, useRef } from "react";

export const JoyControl = (props: {
   onStartMove:(x: number, y: number)=>void,
   onEndMove:()=>void   
}) => {
    const zoneRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        //@ts-ignore
        const joy = nipplejs.default.create({
            mode: "semi",
            catchDistance: 150,
            zone: zoneRef.current,
            size: 200

        });
        (joy as nipplejs.Joystick).on("move", async (evt, data) => {
            props.onStartMove(data.vector.x, data.vector.y);
        });

        (joy as nipplejs.Joystick).on("end", async (evt, data) => {
            props.onEndMove();
        });
    }, [])
    return <div ref={zoneRef} className="stickZone"></div>
}