import { Module } from '@nestjs/common';
import { TrainingSubCategoriesController } from './training_sub_categories.controller';
import { TrainingSubCategoriesService } from './training_sub_categories.service';
import { AuthServise } from '../auth/auth.service';

@Module({
  controllers: [TrainingSubCategoriesController],
  providers: [TrainingSubCategoriesService , AuthServise],
})
export class TrainingSubCategoriesModule {}
