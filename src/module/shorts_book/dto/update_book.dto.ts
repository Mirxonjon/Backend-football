import { IsString, MaxLength } from 'class-validator';

export class UpdateShortBookDto {
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
  short_book_lang: string;
}
