import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMasterClassCategoryDto } from './dto/create_masterclassCategory.dto';
import { TrainingCategoriesEntity } from 'src/entities/training_Categories.entity';
import { extname } from 'path';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { TrainingVideosEntity } from 'src/entities/training_Videos.entity';
import { UpdateMasterclassCategoryDto } from './dto/update_masterclassCategory.dto';
import {
  allowedImageFormats,
  allowedVideoFormats,
} from 'src/utils/videoAndImageFormat';
import { TakeEntity } from 'src/entities/take.entity';

import { UsersEntity } from 'src/entities/users.entity';
import { MasterclassCategoryEntity } from 'src/entities/masterclass_category';
import { Like } from 'typeorm';

@Injectable()
export class MasterClassCategoryServise {
  async getall() {
    const findAllMasterClasses = await MasterclassCategoryEntity.find({
      order: {
        create_data: 'desc',
      },
    });

    return findAllMasterClasses;
  }

  async findOne(id: string) {
    const findMasterClasses = await MasterclassCategoryEntity.find({
      where: {
        id: id,
      },
      order: {
        create_data: 'desc',
      },
      relations: {
        MasterclassVideos: true,
      },
    });

    return findMasterClasses;
  }

  async findAll(pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await MasterclassCategoryEntity.findAndCount({
      order: {
        create_data: 'desc',
      },
      skip: offset,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      results,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        pageSize,
        totalItems: total,
      },
    };
  }

  async getfilterUz(title: string) {
    const filterCategory = await MasterclassCategoryEntity.find({
      where: {
        title: Like(`%${title}%`),
      },
      relations: {
        MasterclassVideos: true,
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return filterCategory;
  }

  async getfilterRu(title: string) {
    const filterCategory = await MasterclassCategoryEntity.find({
      where: {
        title_ru: Like(`%${title}%`),
      },
      relations: {
        MasterclassVideos: true,
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return filterCategory;
  }

  async create(body: CreateMasterClassCategoryDto, image: Express.Multer.File) {
    if (!image) {
      throw new HttpException(
        'image should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    const formatImage = extname(image?.originalname).toLowerCase();
    if (allowedImageFormats.includes(formatImage)) {
      const linkImage = googleCloud(image);

      await MasterclassCategoryEntity.createQueryBuilder()
        .insert()
        .into(MasterclassCategoryEntity)
        .values({
          title: body.title,
          title_ru: body.title_ru,
          title_descrioption: body.title_descrioption,
          title_descrioption_ru: body.title_descrioption_ru,
          img_link: linkImage,
        })
        .execute()
        .catch(() => {
          throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
        });
    } else {
      throw new HttpException(
        'Image should  be format jpg , png , jpeg , pnmj , svg',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    body: UpdateMasterclassCategoryDto,
    image: Express.Multer.File,
  ) {
    const findMasterClass = await MasterclassCategoryEntity.findOne({
      where: { id },
    });

    if (!findMasterClass) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    let formatImage: string = 'Not image';

    if (image) {
      formatImage = extname(image.originalname).toLowerCase();
    }

    if (
      allowedImageFormats.includes(formatImage) ||
      formatImage === 'Not image'
    ) {
      let img_link = findMasterClass.img_link;
      console.log(img_link);

      if (formatImage !== 'Not image') {
        await deleteFileCloud(img_link);
        img_link = googleCloud(image);
      }

      await MasterclassCategoryEntity.update(id, {
        title: body.title || findMasterClass.title,
        title_ru: body.title_ru || findMasterClass.title_ru,
        title_descrioption:
          body.title_descrioption || findMasterClass.title_descrioption,
        title_descrioption_ru:
          body.title_descrioption_ru || findMasterClass.title_descrioption_ru,
        img_link: img_link,
      });
    } else {
      throw new HttpException(
        'Image should be in the format jpg, png, jpeg, pnmj, svg',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const findMasterClass = await MasterclassCategoryEntity.findOneBy({
      id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findMasterClass) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    const imageLink = await deleteFileCloud(findMasterClass?.img_link);

    if (!imageLink) {
      throw new HttpException(
        'The video tactic image  was not deleted',
        HttpStatus.NOT_FOUND,
      );
    }

    await MasterclassCategoryEntity.delete({ id });
  }
}
