import { IsString, MaxLength } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  category_id: string;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(200)
  title_ru: string;

  @IsString()
  description_book: string;

  @IsString()
  description_book_ru: string;

  @IsString()
  book_lang: string;
}
