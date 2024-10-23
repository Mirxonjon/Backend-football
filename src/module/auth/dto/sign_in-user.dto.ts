import { IsString, MaxLength } from 'class-validator';

export class SingInUserDto {
  @IsString()
  @MaxLength(200)
  gmail: string;

  @IsString()
  @MaxLength(200)
  password: string;
}

export class sendCodeMailDto {
  @IsString()
  gmail: string;

}

export class VerifySendCodeMailDto {
  @IsString()
  gmail: string;


  @IsString()
  code: string;
}

export class UpdatePasswordDto {
  @IsString()
  gmail: string;


  @IsString()
  password: string;
}


