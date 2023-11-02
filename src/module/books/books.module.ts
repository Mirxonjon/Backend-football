import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksServise } from './books.service';

@Module({
  controllers: [BooksController],
  providers: [BooksServise],
})
export class BooksModule {}
