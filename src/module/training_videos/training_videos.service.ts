import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrainingVideosDto } from './dto/create_training_video.dto';
import { extname } from 'path';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { TrainingVideosEntity } from 'src/entities/training_Videos.entity';
import { UpdateTrainingVideosDto } from './dto/update_training_video.dto';
import {
  allowedImageFormats,
  allowedVideoFormats,
  openVideosSequance,
} from 'src/utils/videoAndImageFormat';
import { AuthServise } from '../auth/auth.service';
import { CustomHeaders } from 'src/types';
import { TrainingSubCategoriesEntity } from 'src/entities/training_sub_Category';
import { Like } from 'typeorm';

@Injectable()
export class TrainingVideosServise {
  readonly #_auth: AuthServise;
  constructor(auth: AuthServise) {
    this.#_auth = auth;
  }

  // async getall(category_id: string, header: any) {
  //   const userId = 'uuu';
  //   const findCategory = await TrainingCategoriesEntity.findOne({
  //     where : {
  //       id: category_id
  //     },
  //   }).catch((e) => {
  //     throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  //   });
  //   if (!findCategory) {
  //     throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  //   }

  //   const allVideosCategory: any[] = await TrainingVideosEntity.find({
  //     where: {
  //       category_id: {
  //         id: findCategory.id,
  //       },
  //     },
  //     order: {
  //       sequence: 'ASC',
  //     },
  //   }).catch((e) => {
  //     throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  //   });

  //   if (!allVideosCategory) {
  //     throw new HttpException('Videos not found', HttpStatus.NOT_FOUND);
  //   }

  //   const allCourseVideos = [...allVideosCategory];

  //   if (userId) {
  //     const userTakeCourse = await TakeEntity.findOneBy({
  //       user_id: {
  //         id: userId,
  //       },
  //     }).catch(() => {
  //       throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
  //     });

  //     if (userTakeCourse.active) {
  //       for (let i = 0; i < allCourseVideos.length; i++) {
  //         allCourseVideos[i].video_active = true;
  //       }

  //       return allCourseVideos;
  //     } else {
  //       for (let i = 0; i < allCourseVideos.length; i++) {
  //         if (i > 1) {
  //           allCourseVideos[i].video_active = false;
  //           allCourseVideos[i].link = allCourseVideos[i].video_link
  //             .split('')
  //             .map((e, i) => (i % 2 ? 'w' + e : e + 's'))
  //             .join('');
  //         } else {
  //           allCourseVideos[i].video_active = true;
  //         }
  //       }
  //       return allCourseVideos;
  //     }
  //   } else {
  //     for (let i = 0; i < allCourseVideos.length; i++) {
  //       if (i > 1) {
  //         allCourseVideos[i].video_active = false;
  //         allCourseVideos[i].link = allCourseVideos[i].video_link
  //           .split('')
  //           .map((e, i) => (i % 2 ? 'w' + e : e + 's'))
  //           .join('');
  //       } else {
  //         allCourseVideos[i].video_active = false;
  //       }
  //     }
  //     return allCourseVideos;
  //   }
  // }
  async findBySubCategory(id: string) {
    const findBySubCategory = await TrainingVideosEntity.find({
      where: {
        sub_Category_id: {
          id: id,
        },
      },
    });
    return findBySubCategory;
  }

  async findAll() {
    const findAll = await TrainingVideosEntity.find({
      relations: {
        sub_Category_id: true,
      },
    });

    return findAll;
  }

  async findOne(id: string, header: CustomHeaders) {
    const findVideo = await TrainingVideosEntity.findOneBy({ id });

    if (!findVideo) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    if (openVideosSequance.includes(findVideo.sequence)) {
      return findVideo;
    } else if (header.access_token) {
      const data = this.#_auth.verify(header.access_token);

      if (data) {
        return findVideo;
      } else {
        throw new HttpException('token hato', HttpStatus.NOT_FOUND);
      }
    } else {
      findVideo.video_link = `fdsfahbs${findVideo.video_link}ghefhjrtu`;

      return findVideo;
    }
  }

  async getfilterUz(title: string , pageNumber = 1, pageSize = 10 ) {
      const offset = (pageNumber - 1) * pageSize;
  
      const [results, total] = await TrainingVideosEntity.findAndCount({
        where: {
          title: Like(`%${title}%`),
        },
        relations: {
          sub_Category_id: true,
        },
        skip: offset,
        take: pageSize,
      }).catch(() => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
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

  async getfilterRu(title: string , pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await TrainingVideosEntity.findAndCount({
      where: {
        title_ru: Like(`%${title}%`),
      },
      relations: {
        sub_Category_id: true,
      },
      skip: offset,
      take: pageSize,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
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

  async create(
    body: CreateTrainingVideosDto,
    video: Express.Multer.File,
    image: Express.Multer.File,
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

    const findSubCategory = await TrainingSubCategoriesEntity.findOne({
      where: {
        id: body.sub_category_id,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findSubCategory) {
      throw new HttpException(
        'Training Category not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const formatImage = extname(image?.originalname).toLowerCase();
    const formatVideo = extname(video?.originalname).toLowerCase();
    if (allowedImageFormats.includes(formatImage)) {
      if (allowedVideoFormats.includes(formatVideo)) {
        const linkVideo = googleCloud(video);
        const linkImage = googleCloud(image);

        await TrainingVideosEntity.createQueryBuilder()
          .insert()
          .into(TrainingVideosEntity)
          .values({
            title: body.title.toLowerCase(),
            title_ru: body.title_ru.toLowerCase(),
            duration: body.duration,
            sequence: +body.sequence,
            description_tactic: body.description_tactic,
            description_tactic_ru: body.description_tactic_ru,
            tactic_img: linkImage,
            video_link: linkVideo,
            sub_Category_id: findSubCategory,
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
        'image should  be format jpg , png , jpeg , pnmj , svg',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async update(
    id: string,
    body: UpdateTrainingVideosDto,
    video: Express.Multer.File,
    image: Express.Multer.File,
  ) {
    const findVideo = await TrainingVideosEntity.findOne({
      where: { id },
      relations: { sub_Category_id: true },
      select: { sub_Category_id: { id: true } },
    });

    if (!findVideo) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }
    const findSubCategory = await TrainingSubCategoriesEntity.findOneBy({
      id: body.sub_category_id == 'null' ? findVideo.sub_Category_id.id : body.sub_category_id
    });

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
        let tactic_img = findVideo.tactic_img;
        let video_link = findVideo.video_link;

        if (formatImage !== 'Not image') {
          await deleteFileCloud(tactic_img);
          tactic_img = googleCloud(image);
        }

        if (formatVideo !== 'Not video') {
          await deleteFileCloud(video_link);
          video_link = googleCloud(video);
        }

        const updatedVideo = await TrainingVideosEntity.update(id, {
          title: body.title.toLowerCase()|| findVideo.title,
          title_ru: body.title_ru.toLowerCase() || findVideo.title_ru,
          duration: body.duration || findVideo.duration,
          sequence: body.sequence || findVideo.sequence,
          description_tactic:
            body.description_tactic || findVideo.description_tactic,
          description_tactic_ru:
            body.description_tactic_ru || findVideo.description_tactic_ru,
          tactic_img,
          video_link,
          sub_Category_id: findSubCategory || findVideo.sub_Category_id,
        });
        return updatedVideo;
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
    const findVideo = await TrainingVideosEntity.findOneBy({ id }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findVideo) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    const imageLink = await deleteFileCloud(findVideo?.tactic_img);
    const videoLink = await deleteFileCloud(findVideo?.video_link);
    console.log(imageLink, videoLink);

    if (!imageLink) {
      throw new HttpException(
        'The video tactic image  was not deleted',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!videoLink) {
      throw new HttpException(
        'The video tactic video  was not deleted',
        HttpStatus.NOT_FOUND,
      );
    }
    console.log(findVideo);

    await TrainingVideosEntity.delete({ id });
  }
}
