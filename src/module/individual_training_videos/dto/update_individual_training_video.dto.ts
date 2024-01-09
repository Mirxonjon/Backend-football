import { IsString, MaxLength } from 'class-validator';

export class UpdateIndividualTrainingVideosDto {
  @IsString()
  category_id: string;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(200)
  title_ru: string;

  @IsString()
  @MaxLength(10)
  duration: string;

  @IsString()
  sequence: number;

  @IsString()
  description_tactic: string;

  @IsString()
  description_tactic_ru: string;
}
