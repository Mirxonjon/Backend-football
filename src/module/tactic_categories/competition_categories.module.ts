import { Module } from '@nestjs/common';
import { CompetitionCategoriesController } from './competition_categories.controller';
import { CompetitionCategoriesService } from './competition_categories.service';

@Module({
  controllers: [CompetitionCategoriesController],
  providers: [CompetitionCategoriesService],
})
export class CompetitionCategoriesModule {}
