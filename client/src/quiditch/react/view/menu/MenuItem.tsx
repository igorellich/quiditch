import * as React from "react"
const menuItemStyle: React.CSSProperties = {
    color: "red"
}
export const MenuItem=(props:{
    title:string
    onClick:()=>Promise<void>
})=>{
    return <div style={menuItemStyle} className='menuItem' onClick={() => props.onClick()}>{props.title}</div>
}