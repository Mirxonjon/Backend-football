import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMasterClassDto } from './dto/create_masterclass.dto';
import { TrainingCategoriesEntity } from 'src/entities/training_Categories.entity';
import { extname } from 'path';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { TrainingVideosEntity } from 'src/entities/training_Videos.entity';
import { UpdateTacticVideosDto } from './dto/update_tactic_video.dto';
import {
  allowedImageFormats,
  allowedVideoFormats,
} from 'src/utils/videoAndImageFormat';
import { TakeEntity } from 'src/entities/take.entity';
import { TacticCategoriesEntity } from 'src/entities/tactic_Categories.entity';
import { TacticVideosEntity } from 'src/entities/tactic_Videos.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { MasterclassEntity } from 'src/entities/masterclass';

@Injectable()
export class MasterClassServise {
  async getall() {
    const findAllMasterClasses = await MasterclassEntity.find({
      order: {
        create_data : 'desc'
      }
    })

    return findAllMasterClasses
  }

  async findOne(id: string) {
    const findMasterClasses = await MasterclassEntity.find({
      where : {
        id: id
      },
      order: {
        create_data : 'desc'
      }
    })

    return findMasterClasses
  }

  async create(
    body: CreateMasterClassDto,
    title_image: Express.Multer.File,
    image: Express.Multer.File,
  ) {
    if (!title_image) {
      throw new HttpException(
        'image should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }
    if (!image) {
      throw new HttpException(
        'image should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }


    const formatImage = extname(image?.originalname).toLowerCase();
    const formatTitleImage = extname(title_image?.originalname).toLowerCase();
    if (allowedImageFormats.includes(formatImage)) {
      if (allowedImageFormats.includes(formatTitleImage)) {
        const linkTitleImage = googleCloud(title_image);
        const linkImage = googleCloud(image);

        await MasterclassEntity.createQueryBuilder()
          .insert()
          .into(MasterclassEntity)
          .values({
            title: body.title,
            title_ru: body.title_ru,
            description_title: body.description_title,
            description_tactic: body.description_tactic,
            description_tactic_ru: body.description_tactic_ru,
            tactic_img: linkImage,
            title_img_link: linkTitleImage,

          })
          .execute()
          .catch((e) => {
            console.log(e);
            throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
          });
      } else {
        throw new HttpException(
          'Format Title Image should  be format jpg, png, jpeg, pnmj, svg',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        'Image should  be format jpg , png , jpeg , pnmj , svg',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async update(
    id: string,
    body: UpdateTacticVideosDto,
    title_image: Express.Multer.File,
    image: Express.Multer.File,
  ) {
    const findMasterClass = await MasterclassEntity.findOne({
      where: { id },
    });

    if (!findMasterClass) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    let formatImage: string = 'Not image';
    let formatTitleImage: string = 'Not video';

    if (image) {
      formatImage = extname(image.originalname).toLowerCase();
    }
    if (title_image) {
      formatTitleImage = extname(title_image.originalname).toLowerCase();
    }

    // Formatni tekshirish va qo'shilgan fayllarni o'zgartirish
    if (
      allowedImageFormats.includes(formatImage) ||
      formatImage === 'Not image'
    ) {
      if (
        allowedImageFormats.includes(formatTitleImage) ||
        formatTitleImage === 'Not video'
      ) {
        // Rasm va video o'zgartirishlari
        let tactic_img = findMasterClass.tactic_img;
        let title_image_link = findMasterClass.title_img_link;

        if (formatImage !== 'Not image') {
          await deleteFileCloud(tactic_img);
          tactic_img = googleCloud(image);
        }

        if (formatTitleImage !== 'Not video') {
          await deleteFileCloud(title_image_link);
          title_image_link = googleCloud(title_image);
        }

        const updatedVideo = await MasterclassEntity.update(id, {
          title: body.title || findMasterClass.title,
          title_ru: body.title_ru || findMasterClass.title_ru,
          description_title: body.description_title || findMasterClass.description_title,
          description_tactic:
            body.description_tactic || findMasterClass.description_tactic,
          description_tactic_ru:
            body.description_tactic_ru || findMasterClass.description_tactic_ru,
          tactic_img,
          title_img_link : title_image_link
    
        });

        return updatedVideo;
      } else {
        throw new HttpException(
          'format Title Image should be in the format jpg, png, jpeg, pnmj, svg',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        'Image should be in the format jpg, png, jpeg, pnmj, svg',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const findMasterClass = await MasterclassEntity.findOneBy({ id }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findMasterClass) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    const imageLink = await deleteFileCloud(findMasterClass?.tactic_img);
    const title_img_Link = await deleteFileCloud(findMasterClass?.title_img_link);

    if (!imageLink) {
      throw new HttpException(
        'The video tactic image  was not deleted',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!title_img_Link) {
      throw new HttpException(
        'The video tactic video  was not deleted',
        HttpStatus.NOT_FOUND,
      );
    }

    await TacticVideosEntity.delete({ id });
  }
}
