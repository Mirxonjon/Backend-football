import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMasterClassVideoDto } from './dto/create_masterclassVideo.dto';
import { extname } from 'path';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { UpdateMasterclassVideoDto } from './dto/update_masterclassVideo.dto';
import {
  allowedImageFormats,
  allowedVideoFormats,
} from 'src/utils/videoAndImageFormat';
import { MasterclassCategoryEntity } from 'src/entities/masterclass_category';
import { MasterclassVideosEntity } from 'src/entities/masterclass_Videos';
import { Like } from 'typeorm';

@Injectable()
export class MasterClassVideoServise {
  async getall() {
    const findAll = await MasterclassVideosEntity.find({
      order: {
        create_data: 'desc',
      },
      relations: {
        category_id: true,
      },
    });

    return findAll;
  }

  async findOne(id: string) {
    const findMasterClasses = await MasterclassVideosEntity.find({
      where: {
        id: id,
      },
      relations: {
        category_id: true,
      },
      order: {
        create_data: 'desc',
      },
    });

    return findMasterClasses;
  }

  async findAll(pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await MasterclassVideosEntity.findAndCount({
      order: {
        create_data: 'desc',
      },
      relations: {
        category_id: true,
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
    const filterTacticCategory = await MasterclassVideosEntity.find({
      where: {
        title: Like(`%${title}%`),
      },
      relations: {
        category_id: true,
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return filterTacticCategory;
  }

  async getfilterRu(title: string) {
    const filterTacticCategory = await MasterclassVideosEntity.find({
      where: {
        title_ru: Like(`%${title}%`),
      },
      relations: {
        category_id: true,
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return filterTacticCategory;
  }

  async create(
    body: CreateMasterClassVideoDto,
    image: Express.Multer.File,
    video: Express.Multer.File,
  ) {
    if (!video) {
      throw new HttpException(
        'video should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }
    if (!image) {
      throw new HttpException(
        'image should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }
    const findMasterClass = await MasterclassCategoryEntity.findOne({
      where: { id: body.category_id },
    });

    if (!findMasterClass) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    const formatImage = extname(image?.originalname).toLowerCase();
    const formatVideo = extname(video?.originalname).toLowerCase();

    if (allowedImageFormats.includes(formatImage)) {
      if (allowedVideoFormats.includes(formatVideo)) {
        const linkVideo = googleCloud(video);
        const linkImage = googleCloud(image);
        console.log(linkVideo, linkImage);

        await MasterclassVideosEntity.createQueryBuilder()
          .insert()
          .into(MasterclassVideosEntity)
          .values({
            title: body.title,
            title_ru: body.title_ru,
            description_title: body.description_title,
            description_title_ru: body.description_title_ru,
            description_tactic: body.description_tactic,
            description_tactic_ru: body.description_tactic_ru,
            tactic_img: linkImage,
            video_link: linkVideo,
            category_id: findMasterClass,
          })
          .execute()
          .catch((e) => {
            console.log(e);

            throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
          });
      } else {
        throw new HttpException(
          'video should  be format mp4 , mkv , wmv , mov , webm',
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
    body: UpdateMasterclassVideoDto,
    image: Express.Multer.File,
    video: Express.Multer.File,
  ) {
    const findVideo = await MasterclassVideosEntity.findOne({
      where: { id },
      relations: { category_id: true },
      select: { category_id: { id: true } },
    });
    if (!findVideo) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }
    const category_id: string = findVideo.category_id.id;

    const findMasterClass = await MasterclassCategoryEntity.findOneBy({
      id: body.category_id || null,
    });
    console.log(findMasterClass);

    // if (!findMasterClass) {
    //   throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    // }

    let formatImage: string = 'Not image';
    let formatVideo: string = 'Not video';

    if (image) {
      formatImage = extname(image.originalname).toLowerCase();
    }
    if (video) {
      formatVideo = extname(video.originalname).toLowerCase();
    }

    if (
      allowedImageFormats.includes(formatImage) ||
      formatImage === 'Not image'
    ) {
      if (
        allowedVideoFormats.includes(formatVideo) ||
        formatVideo === 'Not video'
      ) {
        let img_link = findVideo.tactic_img;
        let video_link = findVideo.video_link;

        if (formatImage !== 'Not image') {
          await deleteFileCloud(img_link);
          img_link = googleCloud(image);
        }

        if (formatVideo !== 'Not video') {
          await deleteFileCloud(video_link);
          video_link = googleCloud(video);
        }

        await MasterclassVideosEntity.update(id, {
          title: body.title || findVideo.title,
          title_ru: body.title_ru || findVideo.title_ru,
          description_title:
            body.description_title || findVideo.description_title,
          description_title_ru:
            body.description_title_ru || findVideo.description_title_ru,
          description_tactic:
            body.description_tactic || findVideo.description_tactic,
          description_tactic_ru:
            body.description_tactic_ru || findVideo.description_tactic_ru,
          tactic_img: img_link,
          video_link,
          category_id: findMasterClass || findVideo.category_id,
        });
      } else {
        throw new HttpException(
          'Video should be in the format mp4, mkv, wmv, mov, webm',
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
    const findVideo = await MasterclassVideosEntity.findOneBy({ id }).catch(
      () => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      },
    );

    if (!findVideo) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    const imageLink = await deleteFileCloud(findVideo?.tactic_img);

    if (!imageLink) {
      throw new HttpException(
        'The video tactic image  was not deleted',
        HttpStatus.NOT_FOUND,
      );
    }
    const videoLink = await deleteFileCloud(findVideo?.video_link);
    if (!videoLink) {
      throw new HttpException(
        'The video tactic image  was not deleted',
        HttpStatus.NOT_FOUND,
      );
    }

    await MasterclassVideosEntity.delete({ id });
  }
}
