import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { connectDb } from './config/typeorm';
import { TrainingCategoriesModule } from './module/training_categories/training_categories.module';
import { TrainingVideosModule } from './module/training_videos/training_videos.module';
import { AuthModule } from './module/auth/auth.module';
import { CompetitionCategoriesModule } from './module/tactic_categories/competition_categories.module';
import { CompetitionVideosModule } from './module/tactic_videos/competition_videos.module';
import { BooksCategoriesModule } from './module/book_categories/book_categories.module';
import { BooksModule } from './module/books/books.module';
import { MasterClassCategoryModule } from './module/masterclass/masterclass_category.module';
import { ShortCategoriesModule } from './module/shorts_book_categories/short_book_categories.module';
import { ShortBooksModule } from './module/shorts_book/short_books.module';
import { UsersModule } from './module/users/users.module';
import { TrainingSubCategoriesModule } from './module/training_sub_category/training_sub_categories.module';
import { MasterClassVideoModule } from './module/masterclass_video/masterclass_video.module';

@Module({
  imports: [
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot(connectDb),
    AuthModule,
    UsersModule,
    TrainingCategoriesModule,
    TrainingSubCategoriesModule,
    TrainingVideosModule,
    CompetitionCategoriesModule,
    CompetitionVideosModule,
    BooksCategoriesModule,
    BooksModule,
    MasterClassCategoryModule,
    MasterClassVideoModule,
    ShortCategoriesModule,
    ShortBooksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
