import { IsString, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';

export class CreateCompetitionVideosDto {
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
  video_link: string;

  @IsString()
  @IsNotEmpty()
  description_video: string;

  @IsString()
  @IsNotEmpty()
  description_video_ru: string;
}
