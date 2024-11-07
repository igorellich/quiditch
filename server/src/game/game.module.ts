import { Module } from '@nestjs/common';
import {  } from '../app.service';
import { GameService } from './game.service';

@Module({
  controllers: [],
  providers: [GameService],
  exports:[GameModule]
})
export class GameModule {}