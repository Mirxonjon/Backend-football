import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  surname: string;

  @IsString()
  @IsNotEmpty()
  was_born: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  number: string;

  @IsString()
  @IsNotEmpty()
  gmail: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
