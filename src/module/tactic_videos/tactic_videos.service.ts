import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTacticVideosDto } from './dto/create_tactic_video.dto';
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

@Injectable()
export class TacticVideosServise {
  async getall(category_id: string, header: any) {
    const userId = 'uuu';
    const findCategory = await TacticCategoriesEntity.findOneBy({
      id: category_id,
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    if (!findCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    const allVideosCategory: any[] = await TacticVideosEntity.find({
      where: {
        category_id: {
          id: findCategory.id,
        },
      },
      order: {
        sequence: 'ASC',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!allVideosCategory) {
      throw new HttpException('Videos not found', HttpStatus.NOT_FOUND);
    }

    const allCourseVideos = [...allVideosCategory];

    if (userId) {
      const userTakeCourse = await UsersEntity.findOneBy({
        id: userId,
      }).catch(() => {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      });

      // if (userTakeCourse.active) {
      //   for (let i = 0; i < allCourseVideos.length; i++) {
      //     allCourseVideos[i].video_active = true;
      //   }

      //   return allCourseVideos;
      // } else {
      //   for (let i = 0; i < allCourseVideos.length; i++) {
      //     if(i>1) {
      //       allCourseVideos[i].video_active = false;
      //       allCourseVideos[i].link = allCourseVideos[i].video_link
      //       .split('')
      //       .map((e, i) => (i % 2 ? 'w' + e : e + 's'))
      //       .join('');
      //     }else {
      //     allCourseVideos[i].video_active = true;
      //     }
      //   }
      //   return allCourseVideos;
      // }
      return allCourseVideos;
    } else {
      for (let i = 0; i < allCourseVideos.length; i++) {
        if (i > 1) {
          allCourseVideos[i].video_active = false;
          allCourseVideos[i].link = allCourseVideos[i].video_link
            .split('')
            .map((e, i) => (i % 2 ? 'w' + e : e + 's'))
            .join('');
        } else {
          allCourseVideos[i].video_active = false;
        }
      }
      return allCourseVideos;
    }
  }

  async findOne(id: string, header: any) {
    const user_id = false;

    const findVideo = await TacticVideosEntity.findOneBy({ id });

    if (!findVideo) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    if (user_id) {
      return findVideo;
    } else {
      findVideo.video_link = `fdsfahbs${findVideo.video_link}`;

      return findVideo;
    }
  }

  async create(
    body: CreateTacticVideosDto,
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
    console.log(body.tactic_id);

    const findCategory = await TacticCategoriesEntity.findOne({
      where: {
        id: body.tactic_id,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    console.log(findCategory);

    if (!findCategory) {
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

        await TacticVideosEntity.createQueryBuilder()
          .insert()
          .into(TacticVideosEntity)
          .values({
            title: body.title,
            title_ru: body.title_ru,
            duration: body.duration,
            sequence: +body.sequence,
            description_tactic: body.description_tactic,
            description_tactic_ru: body.description_tactic_ru,
            tactic_img: linkImage,
            video_link: linkVideo,
            category_id: findCategory,
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
    body: UpdateTacticVideosDto,
    video: Express.Multer.File,
    image: Express.Multer.File,
  ) {
    const findVideo = await TacticVideosEntity.findOne({
      where: { id },
      relations: { category_id: true },
      select: { category_id: { id: true } },
    });

    if (!findVideo) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    let formatImage: string = 'Not image';
    let formatVideo: string = 'Not video';

    if (image) {
      formatImage = extname(image.originalname).toLowerCase();
    }
    if (video) {
      formatVideo = extname(video.originalname).toLowerCase();
    }

    // Formatni tekshirish va qo'shilgan fayllarni o'zgartirish
    if (
      allowedImageFormats.includes(formatImage) ||
      formatImage === 'Not image'
    ) {
      if (
        allowedVideoFormats.includes(formatVideo) ||
        formatVideo === 'Not video'
      ) {
        // Rasm va video o'zgartirishlari
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

        const updatedVideo = await TacticVideosEntity.update(id, {
          title: body.title || findVideo.title,
          title_ru: body.title_ru || findVideo.title_ru,
          duration: body.duration || findVideo.duration,
          sequence: body.sequence || findVideo.sequence,
          description_tactic:
            body.description_tactic || findVideo.description_tactic,
          description_tactic_ru:
            body.description_tactic_ru || findVideo.description_tactic_ru,
          tactic_img,
          video_link,
          category_id: body.tactic_id || (findVideo.category_id.id as any),
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
    const findVideo = await TacticVideosEntity.findOneBy({ id }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findVideo) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    const imageLink = await deleteFileCloud(findVideo?.tactic_img);
    const videoLink = await deleteFileCloud(findVideo?.video_link);

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

    await TacticVideosEntity.delete({ id });
  }
}
