
export interface IQuiditchFactory<T>{
    createPlayer():Promise<T>;
    createBall():Promise<T>;
    createPlane():Promise<T>
}