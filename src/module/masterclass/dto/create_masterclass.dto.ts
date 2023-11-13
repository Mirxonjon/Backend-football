import { IsString, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';

export class CreateMasterClassDto {

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
  @MaxLength(200)
  description_title: string;

  @IsString()
  @IsNotEmpty()
  description_tactic: string;

  @IsString()
  @IsNotEmpty()
  description_tactic_ru: string;
}
