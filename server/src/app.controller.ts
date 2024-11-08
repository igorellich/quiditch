import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { GameService } from './game/game.service';
import { GameManager } from './quiditch/game/GameManager';
import { World } from "@dimforge/rapier2d-compat"
import { RapierBodyFactory } from './quiditch/factory/rapier/RapierBodyFactory';
import { RapierPhysicsManager } from './engine/rapier/RapierPhysicsManager';
import { QuiditchFactory } from './quiditch/factory/QuiditchActorFactory';
import { GameInputActions } from '@common/quiditch/constants';
import { BaseState } from '@common/engine/BaseState';
import { IPhysicsManager } from './engine/base/IPhysicsManager';
@Controller()
export class AppController {
  private readonly _gameManager: GameManager;

  private readonly _physicsManager: IPhysicsManager;
  constructor(private readonly appService: AppService, private readonly gameService: GameService) {

    const gravity = { x: 0.0, y: 0.0 };
    const world = new World(gravity); 
    const bodyFactory = new RapierBodyFactory(world);
   this._physicsManager = new RapierPhysicsManager(world);
    const quiditchFactory = new QuiditchFactory(bodyFactory, this._physicsManager);
    this._gameManager = new GameManager(quiditchFactory, this._physicsManager);
    console.log("inited")
  }

  @Post('greet')
  async getGreetingMessage(@Body() body: { name: string }): Promise<string> {
    if (await this.gameService.addPlayer(body.name)) {
      return this.appService.getGreetingMessage(body.name);
    } else {
      return null;
    }
  }
  @Get('state')
  async getState(@Body() body: { name: string }): Promise<BaseState[]> {

    return this._gameManager.getStates();

  }
  @Post('control')
  async takeControl(@Body() body: { id: string }): Promise<string> {

    const controlledChaser = body.id ? this._gameManager.getChaserByPlayerId(body.id) : undefined;
    if (!controlledChaser) {
      const freeChaser = this._gameManager.getChasers().filter(c => c.getActor()?.getIsControlled() === false)[0];

      if (freeChaser) {
        this._gameManager.setPlayerChaser(freeChaser, body.id);
        console.log(freeChaser.getActor()?.getId());
        return freeChaser.getActor()?.getId();
      }
    } else {
      return controlledChaser.getActor()?.getId();
    }


  }

  @Post('action')
  async applyAction(@Body() body: ActionDto): Promise<void> {

    if(body.action==="pause"){
      this._gameManager.setPause(!this._gameManager.getPause());
    }

    const chaser = this._gameManager.getChaserByPlayerId(body.id);
    if (chaser) {
      chaser.getActorController().applyAction(body.action, body.started);
    }
  } 

}



export interface ActionDto { id: string; action: GameInputActions; started: boolean }