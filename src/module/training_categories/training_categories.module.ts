import { Module } from '@nestjs/common';
import { TrainingCategoriesController } from './training_categories.controller';
import { TrainingCategoriesService } from './training_categories.service';
import { AuthServise } from '../auth/auth.service';

@Module({
  controllers: [TrainingCategoriesController],
  providers: [TrainingCategoriesService, AuthServise],
})
export class TrainingCategoriesModule {}
