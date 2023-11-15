import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateShortBookDto {
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title_ru: string;

  @IsString()
  @IsNotEmpty()
  description_book: string;

  @IsString()
  @IsNotEmpty()
  description_book_ru: string;

  @IsString()
  @IsNotEmpty()
  short_book_lang: string;
}
