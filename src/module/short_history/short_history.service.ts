import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShortHistoryDto } from './dto/create_history.dto';
import { extname } from 'path';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { UpdateShortHistoryDto } from './dto/update_history.dto';
import {
  allowedImageFormats,
} from 'src/utils/videoAndImageFormat';
import { AuthServise } from '../auth/auth.service';

import { ShortHistoryEntity } from 'src/entities/short_history.entity';

@Injectable()
export class ShortHistoryServise {
  readonly #_authService: AuthServise;
  constructor(authService: AuthServise) {
    this.#_authService = authService;
  }


  async findOne(id: string  ) {
    const findShortHistory = await ShortHistoryEntity.findOneBy({ id }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    if (!findShortHistory) {
      throw new HttpException('short history not found', HttpStatus.NOT_FOUND);
    }
  return findShortHistory
  }



  async findAll() {
    const findHistors = await ShortHistoryEntity.find({
      order:{
        create_data :'desc'
      }
    });

    if (!findHistors) {
      throw new HttpException('Books not found', HttpStatus.NOT_FOUND);
    }

    return findHistors;
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
      
        const linkImage :string = await googleCloud(history_image);
        
        await ShortHistoryEntity.createQueryBuilder()
          .insert()
          .into(ShortHistoryEntity)
          .values({
            title: body.title,
            image_link : linkImage
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

  async update(
    id: string,
    body: UpdateShortHistoryDto ,
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
          image_link :shor_history_img
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
    const findShortHistory = await ShortHistoryEntity.findOneBy({ id }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

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
