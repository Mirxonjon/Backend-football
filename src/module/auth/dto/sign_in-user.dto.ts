import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SingInUserDto {
  @IsString()
  @MaxLength(200)
  gmail: string;

  @IsString()
  @MaxLength(200)
  password: string;
}

export class sendCodeMailDto {
  @IsOptional()
  @IsString()
  gmail: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  password: string;
  
  @IsOptional()
  @IsString()
  phone: string;
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


