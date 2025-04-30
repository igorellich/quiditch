import { BaseState } from "@common/BaseState";
import { Score } from "./Score"
export class MatchState extends BaseState {
    score: Score={};
    name: string = "match";

    paused:boolean = false;
}