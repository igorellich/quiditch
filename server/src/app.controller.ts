import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { GameService } from './game/game.service';
import { Team } from './engine/game/Team';
import { GameManager } from './quiditch/game/GameManager';
import { World } from "@dimforge/rapier2d-compat"
import {ActorState} from "@common/engine/ActorState"
import { RapierBodyFactory } from './quiditch/factory/rapier/RapierBodyFactory';
import { RapierPhysicsManager } from './engine/rapier/RapierPhysicsManager';
import { QuiditchFactory } from './quiditch/factory/QuiditchActorFactory';
import { GameInputActions } from '@common/quiditch/constants';
@Controller()
export class AppController {
  private readonly _gameManager: GameManager;
  constructor(private readonly appService: AppService, private readonly gameService: GameService) {

    let gravity = { x: 0.0, y: 0.0 };
    let world = new World(gravity); const bodyFactory = new RapierBodyFactory(world);
    const physicsManager = new RapierPhysicsManager(world);
    const quiditchFactory = new QuiditchFactory(bodyFactory, physicsManager);
    this._gameManager = new GameManager(quiditchFactory, async () => {
      // score handling
      const score: any = {

      }
      const teams = this._gameManager.getTeams();
      for (const team of teams) {
        score[team.getId()] = 0;
      }
      const setScore = (team?: Team) => {

        let scoreStr = "";
        if (team) {
          const teamId = team.getId();
          score[teamId]++;
        }
        for (let teamId in score) {
          scoreStr += score[teamId] + ' ';
        }
        scoreStr = scoreStr.trim();
        scoreStr = scoreStr.replace(' ', ':');
        console.log(score);

      }
      setScore();
      this._gameManager.addOnGoalHandler(setScore);



    });
    
    physicsManager.init(this._gameManager);
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
  async getState(@Body() body: { name: string }): Promise<ActorState[]> {

    return this._gameManager.getStates();

  }
  @Post('control')
  async takeControl(@Body() body: { id: string }): Promise<string> {

    const freeChaser =  this._gameManager.getChasers().filter(c=>c.getActor()?.getIsControlled()===false)[0];
        if(freeChaser){
            this._gameManager.setPlayerChaser(freeChaser, body.id);
            return freeChaser.getActor()?.getId();
        }
  }

  @Post('action')
  async applyAction(@Body() body: ActionDto): Promise<void> {

    const chaser = this._gameManager.getChaserByPlayerId(body.id);
    if(chaser){
      chaser.getActorController().applyAction(body.action, body.started);
    }
  }

}
export interface ActionDto{ id: string; action:GameInputActions; started:boolean }