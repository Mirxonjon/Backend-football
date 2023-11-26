import { Module } from '@nestjs/common';
import { MasterClassCategoryController } from './masterclass_category.controller';
import { MasterClassCategoryServise } from './masterclass_category.service';

@Module({
  controllers: [MasterClassCategoryController],
  providers: [MasterClassCategoryServise],
})
export class MasterClassCategoryModule {}
