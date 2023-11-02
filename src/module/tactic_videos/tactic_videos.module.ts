import { Module } from '@nestjs/common';
import { TacticVideosController } from './tactic_videos.controller';
import { TacticVideosServise } from './tactic_videos.service';

@Module({
  controllers: [TacticVideosController],
  providers: [TacticVideosServise],
})
export class TacticVideosModule {}
