import { BaseState } from "@common/BaseState";
import { Score } from "./Score"
export class MatchState extends BaseState {
    score: Score={};
    name: string = "match";
    time: number=0;
    paused:boolean = false;
}