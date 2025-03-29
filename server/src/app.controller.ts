import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { GameService } from './game/game.service';
import { QuiditchGameManager } from './quiditch/game/QuiditchGameManager';
import { World } from "@dimforge/rapier2d-compat"
import { RapierBodyFactory } from './quiditch/factory/rapier/RapierBodyFactory';
import { RapierPhysicsManager } from './engine/rapier/RapierPhysicsManager';
import { QuiditchFactory } from './quiditch/factory/QuiditchActorFactory';
import { GameInputActions } from '@common/quiditch/constants';
import { BaseState } from '@common/engine/BaseState';

@Controller()
export class AppController {
  
  
  constructor(private readonly appService: AppService, private readonly gameService: GameService) {
    // TODO перенести логику в AppService
   
  }


  private readonly _gamePlayersMap:Map<string, QuiditchGameManager>=new Map<string, QuiditchGameManager>();

  private _getGame(playerId: string): QuiditchGameManager {
    let result = this._gamePlayersMap.get(playerId);
    if (!result) {
      const gravity = { x: 0.0, y: 0.0 };
      const world = new World(gravity);
      const bodyFactory = new RapierBodyFactory(world);
      const physicsManager = new RapierPhysicsManager(world);
      const quiditchFactory = new QuiditchFactory(bodyFactory, physicsManager);
      result = new QuiditchGameManager(quiditchFactory, physicsManager)
      this._gamePlayersMap.set(playerId, result);

    }
    return result;
  }

  @Get('greets')
  async getGreetingMessage(@Body() body: { name: string }): Promise<string> {
    if (await this.gameService.addPlayer(body.name)) {
      return this.appService.getGreetingMessage(body.name);
    } else {
      return null;
    }
  }
  @Post('state')
  async getState(@Body() body: { id: string }): Promise<BaseState[]> {

    const game = this._getGame(body.id);
    return game.getStates();

  }
  @Post('control')
  async takeControl(@Body() body: { id: string }): Promise<string> {
    const game = this._getGame(body.id);
    const controlledChaser = body.id ? game.getChaserByPlayerId(body.id) : undefined;
    if (!controlledChaser) {
      const freeChaser = game.getChasers().filter(c => c.getActor()?.getIsControlled() === false)[0];

      if (freeChaser) {
        game.setPlayerChaser(freeChaser, body.id);
        console.log(freeChaser.getActor()?.getId());
        return freeChaser.getActor()?.getId();
      }
    } else {
      return controlledChaser.getActor()?.getId();
    }


  }

  @Post('action')
  async applyAction(@Body() body: ActionDto): Promise<void> {
    const game = this._getGame(body.id);
    if(body.action==="pause"){
      game.setPause(!game.getPause());
    }

    const chaser = game.getChaserByPlayerId(body.id);
    if (chaser) {
      chaser.getActorController().applyAction(body.action, body.started);
    }
  } 

}



export interface ActionDto { id: string; action: GameInputActions; started: boolean }