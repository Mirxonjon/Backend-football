import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { TrainingCategoriesEntity } from 'src/entities/training_Categories.entity';
import { TrainingVideosEntity } from 'src/entities/training_Videos.entity';
import { CompetitionCategoriesEntity } from 'src/entities/competition_Categories.entity';
import { CompetitionVideosEntity } from 'src/entities/competition_Videos.entity';
import { BooksCategoriesEntity } from 'src/entities/books_Categories.entity';
import { BooksEntity } from 'src/entities/books.entity';
import { TakeEntity } from 'src/entities/take.entity';
import { TakeBooksEntity } from 'src/entities/take_books.entity';

import { ShortBookCategoriesEntity } from 'src/entities/short_book_Categories.entity';
import { ShortBooksEntity } from 'src/entities/short_books.entity';
import { TrainingSubCategoriesEntity } from 'src/entities/training_sub_Category';
import { MasterclassCategoryEntity } from 'src/entities/masterclass_category';
import { MasterclassVideosEntity } from 'src/entities/masterclass_Videos';
import { IndividualTrainingCategoriesEntity } from 'src/entities/individual_training_category';
import { IndividualTrainingVideosEntity } from 'src/entities/individual_training_videos';
import { ShortHistoryEntity } from 'src/entities/short_history.entity';

dotenv.config();

export const connectDb: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  password: String(process.env.DB_PASSWORD),
  username: process.env.DB_USERNAME,
  database: process.env.DATABASE,
  entities: [
    UsersEntity,
    TrainingCategoriesEntity,
    TrainingSubCategoriesEntity,
    TrainingVideosEntity,,
    IndividualTrainingCategoriesEntity,
    IndividualTrainingVideosEntity,
    CompetitionCategoriesEntity,
    CompetitionVideosEntity,
    BooksCategoriesEntity,
    BooksEntity,
    TakeEntity,
    TakeBooksEntity,
    MasterclassCategoryEntity,
    MasterclassVideosEntity,
    ShortBookCategoriesEntity,
    ShortBooksEntity,
    ShortHistoryEntity
  ],
  autoLoadEntities: true,
  synchronize: true,
};
