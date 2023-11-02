import { IsString, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';

export class CreateTacticVideosDto {
  @IsString()
  @IsNotEmpty()
  tactic_id: string;

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
  @MaxLength(10)
  duration: string;

  @IsString()
  @IsNotEmpty()
  sequence: number;

  @IsString()
  @IsNotEmpty()
  description_tactic: string;

  @IsString()
  @IsNotEmpty()
  description_tactic_ru: string;
}
