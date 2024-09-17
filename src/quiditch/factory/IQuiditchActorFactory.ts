
export interface IQuiditchFactory<T>{
    createPlayer():Promise<T>;
    createBall():Promise<T>;
    createGround():Promise<T>;
    
    createWalls():Promise<T>;
}