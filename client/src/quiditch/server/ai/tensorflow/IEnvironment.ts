// a common interface for training and testing environments
export interface IEnvironment<TGameState> {
    step(action: number): Promise<{reward:number, done:boolean, state:TGameState}>;
    reset(): Promise<TGameState>;
    getActionsCount(): number;
    getFlatState(state:TGameState): Promise<any[]>;
    getStateShape(): number;
}