import { MatchState } from "../../common/MatchState";
import * as React from "react"

export const ScoreComponent = (props: {
    matchStateGetter: ()=>Promise<MatchState>
}) => {
    const [score, setScore] = React.useState<string>("");
    React.useEffect(() => {
        const intervalId = setInterval(async () => {
            //const matchState: MatchState = props.stateSynchroniser.getStates().filter(s => (s as MatchState).score)[0] as MatchState;
            const matchState = await props.matchStateGetter();
            if (matchState) {              
                    let scoreStr = "";
                    for (let teamId in matchState.score) {
                        scoreStr += matchState.score[teamId] + ' ';
                    }
                    scoreStr = scoreStr.trim();
                    scoreStr = scoreStr.replace(' ', ':');
                    setScore(scoreStr);
                
            } else {
                //clearInterval(intervalId);
            }

        }, 300)
    }, [])

    return <div className="goals">{score}</div>
}