import { IsString, MaxLength } from 'class-validator';

export class UpdateCompetitionCategory {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(200)
  title_ru: string;
}
