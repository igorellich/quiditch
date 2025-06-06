import { MatchState } from "../../../common/MatchState";
import * as React from "react"


const PointsComponent=(props: {
    points: string;
    color: string;
})=>{
    return <label style={{color:props.color}}>{props.points}</label>
}

export const ScoreComponent = (props: {
    matchStateGetter: ()=>Promise<MatchState>
}) => {
    const [points, setPoints] = React.useState<React.JSX.Element[]>([]);
    React.useEffect(() => {
        const intervalId = setInterval(async () => {
            //const matchState: MatchState = props.stateSynchroniser.getStates().filter(s => (s as MatchState).score)[0] as MatchState;
            const matchState = await props.matchStateGetter();
            if (matchState) {              
                    
                    const pointComponents:React.JSX.Element[] = [];
                    for (let teamId in matchState.score) {
                        pointComponents.push(<PointsComponent key={teamId} color={teamId} points={matchState.score[teamId].toString()}/>)
                    }
                    
                    setPoints(pointComponents);
                
            } 
            return ()=>{
                clearInterval(intervalId);
            }
        }, 300)
    }, [])

    return <div className="goals">{points.map((p,i)=>{
        return <span key={i}>{p}{(i+1==points.length?"":":")}</span>
    })}</div>
}