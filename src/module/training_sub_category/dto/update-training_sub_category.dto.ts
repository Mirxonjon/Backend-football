import { IsString, MaxLength } from 'class-validator';

export class UpdateTrainingSubCategory {
  @IsString()
  @MaxLength(200)
  category_id: string;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(200)
  title_ru: string;
}
