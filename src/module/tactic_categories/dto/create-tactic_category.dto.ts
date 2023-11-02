import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTacticCategoryDto {
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
  tactic_category: string;
}
