import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { TrainingCategoriesEntity } from 'src/entities/training_Categories.entity';
import { TrainingVideosEntity } from 'src/entities/training_Videos.entity';
import { TacticCategoriesEntity } from 'src/entities/tactic_Categories.entity';
import { TacticVideosEntity } from 'src/entities/tactic_Videos.entity';
import { BooksCategoriesEntity } from 'src/entities/books_Categories.entity';
import { BooksEntity } from 'src/entities/books.entity';
import { TakeEntity } from 'src/entities/take.entity';
import { TakeBooksEntity } from 'src/entities/take_books.entity';
import { MasterclassEntity } from 'src/entities/masterclass';

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
    TrainingVideosEntity,
    TacticCategoriesEntity,
    TacticVideosEntity,
    BooksCategoriesEntity,
    BooksEntity,
    TakeEntity,
    TakeBooksEntity,
    MasterclassEntity
  ],
  autoLoadEntities: true,
  synchronize: true,
};
