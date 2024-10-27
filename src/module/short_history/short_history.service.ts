import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSeenHistoryDto, CreateShortHistoryDto } from './dto/create_history.dto';
import { extname } from 'path';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { UpdateShortHistoryDto } from './dto/update_history.dto';
import {
  allowedImageFormats,
} from 'src/utils/videoAndImageFormat';
import { AuthServise } from '../auth/auth.service';

import { ShortHistoryEntity } from 'src/entities/short_history.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { SeenHistoryEntity } from 'src/entities/seen_short_history.entity';

@Injectable()
export class ShortHistoryServise {
  readonly #_authService: AuthServise;
  constructor(authService: AuthServise) {
    this.#_authService = authService;
  }

  async findOne(id: string) {
    const findShortHistory = await ShortHistoryEntity.findOneBy({ id }).catch(
      (e) => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      },
    );
    if (!findShortHistory) {
      throw new HttpException('short history not found', HttpStatus.NOT_FOUND);
    }
    return findShortHistory;
  }

  async findAll() {
    const findHistors = await ShortHistoryEntity.find({
      order: {
        create_data: 'desc',
      },
    });

    if (!findHistors) {
      throw new HttpException('History not found', HttpStatus.NOT_FOUND);
    }

    return findHistors;
  }

  async findAllwithSeen(header: any) {
    if (header.authorization) {
      const user = await this.#_authService.verify(
        header.authorization.split(' ')[1],
      );
      const findUser = await UsersEntity.findOneBy({ id: user.id });
      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const findHistors :ShortHistoryEntity []= await ShortHistoryEntity.find({
        where: [
          {
            seen_histories: {
              userId: {
                id: findUser.id,
              },
            },
          },
        ],
        order: {
          create_data: 'desc',
        },
        relations: {
          seen_histories: true,
        },
      });
      
      const findHistorAll = await ShortHistoryEntity.find({
        where: {
        },
        order: {
          create_data: 'desc',
        },
        relations: {
          seen_histories: true,
        },
      });
      let seenArr = []
      let allSeenHistoryIdArr  = []
      for (let e of findHistors) {
              allSeenHistoryIdArr.push(e.id);
        seenArr.push({
          id: e.id,
          image_link: e.image_link,
          create_data: e.create_data,
          seen: e.seen_histories[0].seen,
        });
            }

            let newHistoryArr = []
      for (let e of findHistorAll) {
        if (!allSeenHistoryIdArr.includes(e.id)) {
          newHistoryArr.push({
            id: e.id,
            image_link: e.image_link,
            create_data: e.create_data,
            seen:'false',
          });
        }
      }

      if (!findHistors) {
        throw new HttpException('Histories not found', HttpStatus.NOT_FOUND);
      }

      return {
        status: 200,
        data: [
          ...newHistoryArr,
          ...seenArr
        ]
      };
    } else {
      throw new HttpException('token not found', HttpStatus.FORBIDDEN);
    }
  }

  async create(
    body: CreateShortHistoryDto,
    history_image: Express.Multer.File,
  ) {
    if (!history_image) {
      throw new HttpException(
        'history_image should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    const formatImage = extname(history_image?.originalname).toLowerCase();
    if (allowedImageFormats.includes(formatImage)) {
      const linkImage: string = await googleCloud(history_image);

      await ShortHistoryEntity.createQueryBuilder()
        .insert()
        .into(ShortHistoryEntity)
        .values({
          title: body.title,
          image_link: linkImage,
        })
        .execute()
        .catch((e) => {
          throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
        });
    } else {
      throw new HttpException(
        'image should  be format jpg , png , jpeg , pnmj , svg',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createSeen(header: any, body: CreateSeenHistoryDto) {
    if (header.authorization) {
      const user = await this.#_authService.verify(
        header.authorization.split(' ')[1],
      );
      const findUser = await UsersEntity.findOneBy({ id: user.id });
      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      for (let e of body.history_ids) {
        await SeenHistoryEntity.createQueryBuilder()
          .insert()
          .into(SeenHistoryEntity)
          .values({
            userId: findUser,
            shortHistoryId: {
              id: e,
            },
            seen: 'true',
          })
          .execute()
          .catch((e) => {
            throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
          });
      }

      return {
        status: 200,
        message: 'seen history add successful',
      };
    } else {
      throw new HttpException('token not found', HttpStatus.FORBIDDEN);
    }
  }

  async update(
    id: string,
    body: UpdateShortHistoryDto,
    history_image: Express.Multer.File,
  ) {
    const findHistory = await ShortHistoryEntity.findOne({
      where: { id },
    });

    if (!findHistory) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    let formatImage: string = 'Not image';

    if (history_image) {
      formatImage = extname(history_image.originalname).toLowerCase();
    }

    if (
      allowedImageFormats.includes(formatImage) ||
      formatImage === 'Not image'
    ) {
      let shor_history_img = findHistory.image_link;

      if (formatImage !== 'Not image') {
        // await deleteFileCloud(shor_history_img);
        shor_history_img = await googleCloud(history_image);
      }

      const updated = await ShortHistoryEntity.update(id, {
        title: body.title || findHistory.title,
        image_link: shor_history_img,
      });

      return updated;
    } else {
      throw new HttpException(
        'Image should be in the format jpg, png, jpeg, pnmj, svg',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const findShortHistory = await ShortHistoryEntity.findOneBy({ id }).catch(
      () => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      },
    );

    if (!findShortHistory) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    const imageLink = await deleteFileCloud(findShortHistory?.image_link);

    if (!imageLink) {
      throw new HttpException(
        'The video tactic image  was not deleted',
        HttpStatus.NOT_FOUND,
      );
    }

    await ShortHistoryEntity.delete({ id });
  }
}
