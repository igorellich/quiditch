import * as React from "react"

const menuItemStyle: React.CSSProperties = {
    color: "gold",
    backgroundColor: "black",
    padding: "10px 20px",
    margin: "5px 0",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid transparent",
    boxShadow: "0 0 5px rgba(0,0,0,0.5)",
    fontFamily: "'Cinzel', serif", // Harry Potter-like font (add this font in your CSS)
};

const hoverStyle: React.CSSProperties = {
    backgroundColor: "#111", // Slightly lighter black
    color: "#ffd700", // Brighter gold
    boxShadow: "0 0 15px gold, 0 0 5px rgba(255,215,0,0.5)", // Glowing effect
    border: "1px solid gold",
    transform: "scale(1.02)", // Slight zoom effect
};

export const MenuItem = (props:{
    title:string
    onClick:() => Promise<void>
}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div 
            style={{...menuItemStyle, ...(isHovered ? hoverStyle : {})}} 
            className='menuItem' 
            onClick={() => props.onClick()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {props.title}
        </div>
    )
}
