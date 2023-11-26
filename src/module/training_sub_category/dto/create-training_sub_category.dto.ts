import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTrainingSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  category_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title_ru: string;
}
