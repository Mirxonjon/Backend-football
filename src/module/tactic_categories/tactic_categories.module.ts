import { Module } from '@nestjs/common';
import { TacticCategoriesController } from './tactic_categories.controller';
import { TacticCategoriesService } from './tactic_categories.service';

@Module({
  controllers: [TacticCategoriesController],
  providers: [TacticCategoriesService],
})
export class TacticCategoriesModule {}
