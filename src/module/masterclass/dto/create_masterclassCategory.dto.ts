import { IsString, IsNotEmpty, MaxLength  } from 'class-validator';

export class CreateMasterClassCategoryDto {

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
  title_descrioption: string;

  @IsString()
  @IsNotEmpty()
  title_descrioption_ru: string;
}
