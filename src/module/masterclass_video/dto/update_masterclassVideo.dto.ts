import { IsString, MaxLength } from 'class-validator';

export class UpdateMasterclassVideoDto {
  @IsString()
  category_id: string;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(200)
  title_ru: string;

  @IsString()
  @MaxLength(200)
  description_title: string;

  @IsString()
  description_title_ru: string;

  @IsString()
  description_tactic: string;

  @IsString()
  description_tactic_ru: string;
}
