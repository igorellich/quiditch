export interface ITickable{
    tick(elapsedTime:number, deltaTime: number):Promise<void>;
}