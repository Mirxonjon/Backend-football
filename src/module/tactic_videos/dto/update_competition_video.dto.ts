import { IsString, MaxLength } from 'class-validator';

export class UpdateCompetitionVideosDto {
  @IsString()
  tactic_id: string;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(200)
  title_ru: string;

  @IsString()
  @MaxLength(200)
  video_link: string;

  @IsString()
  description_video: string;

  @IsString()
  description_video_ru: string;
}
