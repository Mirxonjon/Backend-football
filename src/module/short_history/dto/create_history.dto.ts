import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsArray } from 'class-validator';

export class CreateShortHistoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

}


// 4a4c0c69-4c7a-40d4-8746-a7b6c5c65a38
// 33a671f7-c70c-415f-aa04-ca4571ad0b37
export class CreateSeenHistoryDto {
  @ApiProperty({
    type: [String],
    required: true,
    example: [
      '55cc8c2d-34c1-4ca3-88e0-7b1295875642',
      '55cc8c2d-34c1-4ca3-88e0-7b1295875642',
    ],
  })
  @IsNotEmpty()
  @IsArray()
  history_ids: string[];
}