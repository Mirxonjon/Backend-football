import { IsString, MaxLength } from 'class-validator';

export class UpdateMasterclassCategoryDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(200)
  title_ru: string;


  @IsString()
  title_descrioption: string;

  @IsString()
  title_descrioption_ru: string;
}
