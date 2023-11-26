import { Module } from '@nestjs/common';
import { TrainingVideosController } from './training_videos.controller';
import { TrainingVideosServise } from './training_videos.service';
import { AuthModule } from '../auth/auth.module';
import { AuthServise } from '../auth/auth.service';

@Module({
  imports: [],
  controllers: [TrainingVideosController],
  providers: [TrainingVideosServise, AuthServise],
})
export class TrainingVideosModule {}
