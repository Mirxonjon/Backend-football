import { Module } from '@nestjs/common';
import { CompetitionVideosController } from './competition_videos.controller';
import { CompetitionVideosServise } from './competition_videos.service';

@Module({
  controllers: [CompetitionVideosController],
  providers: [CompetitionVideosServise],
})
export class CompetitionVideosModule {}
