import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { connectDb } from './config/typeorm';
import { TrainingCategoriesModule } from './module/training_categories/training_categories.module';
import { TrainingVideosModule } from './module/training_videos/training_videos.module';
import { AuthModule } from './module/auth/auth.module';
import { TacticCategoriesModule } from './module/tactic_categories/tactic_categories.module';
import { TacticVideosModule } from './module/tactic_videos/tactic_videos.module';
import { BooksCategoriesModule } from './module/book_categories/book_categories.module';
import { BooksModule } from './module/books/books.module';
import { MasterClassModule } from './module/masterclass/masterclass.module';

@Module({
  imports: [
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot(connectDb),
    AuthModule,
    TrainingCategoriesModule,
    TrainingVideosModule,
    TacticCategoriesModule,
    TacticVideosModule,
    BooksCategoriesModule,
    BooksModule,
    MasterClassModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
