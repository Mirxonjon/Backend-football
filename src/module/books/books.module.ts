import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksServise } from './books.service';
import { AuthServise } from '../auth/auth.service';

@Module({
  controllers: [BooksController],
  providers: [BooksServise,AuthServise],
})
export class BooksModule {}
