import { Module } from '@nestjs/common';
import { ShortBooksController } from './books.controller';
import { ShortBooksServise } from './books.service';

@Module({
  controllers: [ShortBooksController],
  providers: [ShortBooksServise],
})
export class ShortBooksModule {}
