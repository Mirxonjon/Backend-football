import { Module } from '@nestjs/common';
import { IndivudualTrainingCategoriesController } from './indivudual_training_categories.controller';
import { IndivudualTrainingCategoriesService } from './indivudual_training_categories.service';
import { AuthServise } from '../auth/auth.service';

@Module({
  controllers: [IndivudualTrainingCategoriesController],
  providers: [IndivudualTrainingCategoriesService, AuthServise],
})
export class IndivudualTrainingCategoriesModule {}
