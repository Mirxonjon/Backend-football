import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from 'src/entities/users.entity';
import { SingInUserDto, UpdatePasswordDto, VerifySendCodeMailDto, sendCodeMailDto } from './dto/sign_in-user.dto';
import { generateRandomFiveDigitNumber } from 'src/utils/random';

@Injectable()
export class AuthServise {
  constructor(private readonly jwtServise: JwtService) {}
  async createUser(createUser: CreateUserDto) {
    const findUser = await UsersEntity.findOne({
      where: {
        email: createUser.gmail,
        phone: createUser.number,
      },
    }).catch((e) => {
      throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
    });

    if (findUser) {
      throw new HttpException(
        'Gmail or Number already registered',
        HttpStatus.FOUND,
      );
    }

    const addedUser = await UsersEntity.createQueryBuilder()
      .insert()
      .into(UsersEntity)
      .values({
        name: createUser.name,
        surname: createUser.surname,
        phone: createUser.number,
        email: createUser.gmail,
        password: createUser.password,
        was_born_date: createUser.was_born,
      })
      .returning(['id', 'role'])
      .execute()
      .catch((e) => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });

    return {
      message: 'You have successfully registered',
      token: this.sign(addedUser.raw.at(-1).id, addedUser.raw.at(-1).role),
    };
  }
  async signIn(signInDto: SingInUserDto) {
    const finduser = await UsersEntity.findOne({
      where: {
        email: signInDto.gmail,
        password: signInDto.password,
      },
    }).catch((e) => {
      throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
    });

    if (!finduser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'successfully sing In',
      token: this.sign(finduser.id, finduser.role),
    };
  }
  
  async sendCodeMail(body: sendCodeMailDto) {
    const finduser = await UsersEntity.findOne({
      where: {
        email: body.gmail,
      },
    }).catch((e) => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });

    if (!finduser) {
      throw new HttpException('Not found Gmail', HttpStatus.NOT_FOUND);
    }
    let randomCode = generateRandomFiveDigitNumber()
    const updatedUser = await UsersEntity.update(finduser.id , {
      code : randomCode.toString(),
      codeTime: new Date(),
    });

    return {
      randomCode , 
      message: 'send code',
      // token: this.sign(finduser.id, finduser.role),
    };
  }

  async verifySendCodeMail(body: VerifySendCodeMailDto) {
    const finduser = await UsersEntity.findOne({
      where: {
        email: body.gmail,
      
      },
    }).catch((e) => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });

    if (!finduser) {
      throw new HttpException('Not found Gmail', HttpStatus.BAD_REQUEST);
    }

    if(finduser.code != body.code.toString()) {
      throw new HttpException('wrong password', HttpStatus.NOT_FOUND);
    }


    // const updatedUser = await UsersEntity.update(finduser.id , {
    //   code : randomCode.toString()
    // });

    return {
      status : 200 , 
      message: 'successful',
      // token: this.sign(finduser.id, finduser.role),
    };
  }

  async updatePassword(body: UpdatePasswordDto) {
    const finduser = await UsersEntity.findOne({
      where: {
        email: body.gmail,
      
      },
    }).catch((e) => {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    });

    if (!finduser) {
      throw new HttpException('Not found Gmail', HttpStatus.BAD_REQUEST);
    }
    const updatedUser = await UsersEntity.update(finduser.id , {
     password: body.password
    });

    return {
      status : 200 , 
      message: 'successful',
      // token: this.sign(finduser.id, finduser.role),
    };
  }
  sign(id: string, role: string) {
    return this.jwtServise.sign({ id, role });
  }

  async verify(token: string) {
    try {
      const verifytoken = await this.jwtServise
        .verifyAsync(token)
        .catch((e) => {
          // throw new UnauthorizedException(e);
          throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        });
      return verifytoken;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
