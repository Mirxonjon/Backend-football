import { Post, Body, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { AuthServise } from './auth.service';
import { Controller } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SingInUserDto } from './dto/sign_in-user.dto';

@Controller('Auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthServise) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'surname', 'was_born', 'number', 'gmail', 'password'],
      properties: {
        name: {
          type: 'string',
          default: 'Eshmat',
        },
        surname: {
          type: 'string',
          default: 'Toshmatov',
        },
        was_born: {
          type: 'string',
          default: '08.08.2000',
        },
        number: {
          type: 'string',
          default: '+998933843484',
        },
        gmail: {
          type: 'string',
          default: 'Eshmat@gmail.com',
        },
        password: {
          type: 'string',
          default: '123',
        },
      },
    },
  })
  register(@Body() body: CreateUserDto) {
    return this.service.createUser(body);
  }
  @Post('/signIn')
  @HttpCode(HttpStatus.FOUND)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['gmail', 'password'],
      properties: {
        gmail: {
          type: 'string',
          default: 'Eshmat@gmail.com',
        },
        password: {
          type: 'string',
          default: '123',
        },
      },
    },
  })
  signIn(@Body() body: SingInUserDto) {
    return this.service.signIn(body);
  }


}
