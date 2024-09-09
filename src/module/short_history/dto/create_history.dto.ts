import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateShortHistoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

}
