import { Post, Body, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { AuthServise } from './auth.service';
import { Controller } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  SingInUserDto,
  UpdatePasswordDto,
  VerifySendCodeMailDto,
  sendCodeMailDto,
} from './dto/sign_in-user.dto';

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
  @HttpCode(HttpStatus.OK)
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

  @Post('/register-with-mail')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['gmail'],
      properties: {
        gmail: {
          type: 'string',
          default: 'mirxonjonismanov152@gmail.com',
        },
        name: {
          type: 'string',
          default: 'mirxonjonismanov152@gmail.com',
        },
        password: {
          type: 'string',
          default: 'Eshmat@gmail.com',
        },
        phone: {
          type: 'string',
          default: 'Eshmat@gmail.com',
        },
      },
    },
  })
  RegistorWithMail(@Body() body: sendCodeMailDto) {
    return this.service.RegistorWithMail(body);
  }

  @Post('/send-code-mail')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['gmail'],
      properties: {
        gmail: {
          type: 'string',
          default: 'Eshmat@gmail.com',
        },
      },
    },
  })
  sendCodeMail(@Body() body: sendCodeMailDto) {
    return this.service.sendCodeMail(body);
  }

  @Post('/verify-send-code-mail')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['gmail'],
      properties: {
        gmail: {
          type: 'string',
          default: 'Eshmat@gmail.com',
        },
        code: {
          type: 'string',
          default: '1265',
        },
      },
    },
  })
  verifySendCodeMail(@Body() body: VerifySendCodeMailDto) {
    return this.service.verifySendCodeMail(body);
  }

  @Post('/update-password')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['gmail'],
      properties: {
        gmail: {
          type: 'string',
          default: 'Eshmat@gmail.com',
        },
        password: {
          type: 'string',
          default: '1265',
        },
      },
    },
  })
  updatePassword(@Body() body: UpdatePasswordDto) {
    return this.service.updatePassword(body);
  }
}
