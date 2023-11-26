import { IsString, IsNotEmpty, MaxLength  } from 'class-validator';

export class CreateMasterClassVideoDto {

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
  @MaxLength(200)
  description_title: string;

  @IsString()
  @IsNotEmpty()
  description_title_ru: string;

  @IsString()
  @IsNotEmpty()
  description_tactic: string;

  @IsString()
  @IsNotEmpty()
  description_tactic_ru: string;

}
