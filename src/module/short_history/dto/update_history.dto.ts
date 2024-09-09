import { IsString, MaxLength } from 'class-validator';

export class UpdateShortHistoryDto {
  @IsString()
  title: string;
}
