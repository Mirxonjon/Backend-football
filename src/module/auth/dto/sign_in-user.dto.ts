import { IsString, MaxLength } from 'class-validator';

export class SingInUserDto {
  @IsString()
  @MaxLength(200)
  gmail: string;

  @IsString()
  @MaxLength(200)
  password: string;
}
