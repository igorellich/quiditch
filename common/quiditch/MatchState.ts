import { BaseState } from "@common/engine/BaseState";
import { Score } from "./Score"
export class MatchState extends BaseState {
    score: Score;
    name: string = "match";
}