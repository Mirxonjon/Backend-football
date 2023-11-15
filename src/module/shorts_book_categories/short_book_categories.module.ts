import { Module } from '@nestjs/common';
import { ShortBooksCategoriesController } from './short_book_categories.controller';
import { ShortBooksCategoriesService } from './short_book_categories.service';

@Module({
  controllers: [ShortBooksCategoriesController],
  providers: [ShortBooksCategoriesService],
})
export class ShortCategoriesModule {}
