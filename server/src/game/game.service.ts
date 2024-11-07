import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {

    private _players:string[];
    constructor(){
        this._players = [];
    }
  async addPlayer(id:string):Promise<boolean>{
    if(!this._players.includes(id)){
        this._players.push(id);
        return true;
    }
    return false;
  }
  async getPlayers():Promise<string[]>{
    return [...this._players];
  }
}
