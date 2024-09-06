
export interface IQuiditchFactory<T>{
    createPlayer():Promise<T>
}