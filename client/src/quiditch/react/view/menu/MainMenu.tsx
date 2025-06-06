import * as React from 'react';
import { MenuItem } from './MenuItem';

const mainMenuStyle: React.CSSProperties = {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "absolute",
    zIndex: 2
}
export const MainMenu = (props: {
    onContinue?: () => Promise<void>,
    onNew: () => Promise<void>
}) => {
    return <div style={mainMenuStyle} className='mainMenu'>

        <MenuItem onClick={() => props.onNew()} title='New Game'/>
        {props.onContinue && <MenuItem onClick={ props.onContinue} title='Continue'/>}
        
    </div>
}