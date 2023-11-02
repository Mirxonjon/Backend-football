import { Module } from '@nestjs/common';
import { BooksCategoriesController } from './book_categories.controller';
import { BooksCategoriesService } from './book_categories.service';

@Module({
  controllers: [BooksCategoriesController],
  providers: [BooksCategoriesService],
})
export class BooksCategoriesModule {}
