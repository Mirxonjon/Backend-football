import { Module } from '@nestjs/common';
import { IndividualTrainingVideosController } from './individual_training_videos.controller';
import { IndividualTrainingVideosServise } from './individual_training_videos.service';
import { AuthModule } from '../auth/auth.module';
import { AuthServise } from '../auth/auth.service';

@Module({
  imports: [],
  controllers: [IndividualTrainingVideosController],
  providers: [IndividualTrainingVideosServise, AuthServise],
})
export class IndividualTrainingVideosModule {}
