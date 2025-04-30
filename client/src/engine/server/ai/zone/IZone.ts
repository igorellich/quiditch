export interface IZone<TPoint>{
    getRandomPoint():Promise<TPoint>;
    belongs(point:TPoint):Promise<boolean>;
}