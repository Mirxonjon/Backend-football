import { Module } from '@nestjs/common';
import { ShortBooksController } from './short_books.controller';
import { ShortBooksServise } from './short_books.service';
import { AuthServise } from '../auth/auth.service';

@Module({
  controllers: [ShortBooksController],
  providers: [ShortBooksServise,AuthServise],
})
export class ShortBooksModule {}
