import { Module } from '@nestjs/common';
import { ShortBooksController } from './short_books.controller';
import { ShortBooksServise } from './short_books.service';

@Module({
  controllers: [ShortBooksController],
  providers: [ShortBooksServise],
})
export class ShortBooksModule {}
