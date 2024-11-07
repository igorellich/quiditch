export interface IQuiditchFactory<T>{
    createPlayer(color?:string, id?:string):Promise<T>;
    createQuaffle(id?:string):Promise<T>;
    createGround(id?:string):Promise<T|undefined>;
    
    createWalls(id?:string):Promise<T>;

    // createPointer(targetObject?: IObject2D, sourceActor?:IActor, id?:string):Promise<T|undefined>;

    createGates(ringRadius:number,id?:string):Promise<T>;
}