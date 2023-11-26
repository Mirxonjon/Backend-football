import { AuthServise } from '../auth/auth.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrainingSubCategoryDto } from './dto/create-training_sub_category.dto';
import { TrainingCategoriesEntity } from 'src/entities/training_Categories.entity';
import { UpdateTrainingSubCategory } from './dto/update-training_sub_category.dto';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { extname } from 'path';
import { CustomHeaders } from 'src/types';
import { TrainingSubCategoriesEntity } from 'src/entities/training_sub_Category';
import { Like } from 'typeorm';

@Injectable()
export class TrainingSubCategoriesService {
  readonly #_authService: AuthServise;
  constructor(authService: AuthServise) {
    this.#_authService = authService;
  }
  // async getfilter(age: string) {
  //   const allTrainingCategory = await TrainingCategoriesEntity.find({
  //     where: {
  //       traning_for_age: age,
  //     },
  //   }).catch((e) => {
  //     throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  //   });

  //   return allTrainingCategory;
  // }

  async getall() {
    const allTrainingSubCategory = await TrainingSubCategoriesEntity.find({
      relations: {
        category_id: true,
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    return allTrainingSubCategory;
  }

  async findOne(id: string, header: CustomHeaders) {
    const findSubCategory: any = await TrainingSubCategoriesEntity.findOne({
      where: {
        id: id,
      },
      relations: {
        Training_videos: true,
      },
      order: {
        Training_videos: {
          sequence: 'ASC',
        },
      },
      select: {
        Training_videos: {
          video_link: true,
          duration: true,
          sequence: true,
          title: true,
          title_ru: true,
        },
      },
    });
    let allCourseVideos = [...findSubCategory.Training_videos];

    if (header.access_token) {
      const user = await this.#_authService.verify(header.access_token);

      if (user.id) {
        for (let i: number = 0; i < allCourseVideos.length; i++) {
          allCourseVideos[i].active = true;
          allCourseVideos[i].link = allCourseVideos[i].video_link;
        }
        findSubCategory.Training_videos = allCourseVideos;
        return findSubCategory;
      } else {
        for (let i: number = 0; i < allCourseVideos.length; i++) {
          if ((i) => 2) {
            allCourseVideos[i].active = false;
            allCourseVideos[i].video_link.split();
            allCourseVideos[i].link = allCourseVideos[i].video_link
              .split('')
              .map((e, i) => (i % 2 ? 'w' + e : e + 's'))
              .join('');
          } else {
            allCourseVideos[i].active = true;
            allCourseVideos[i].link = allCourseVideos[i].video_link;
          }
        }
        findSubCategory.Training_videos = allCourseVideos;
        return findSubCategory;
      }
    } else {
      for (let i: number = 0; i < allCourseVideos.length; i++) {
        if ((i) => 2) {
          allCourseVideos[i].active = false;
          allCourseVideos[i].video_link.split();
          allCourseVideos[i].link = allCourseVideos[i].video_link
            .split('')
            .map((e, i) => (i % 2 ? 'w' + e : e + 's'))
            .join('');
        } else {
          allCourseVideos[i].active = true;
          allCourseVideos[i].link = allCourseVideos[i].video_link;
        }
      }
      findSubCategory.Training_videos = allCourseVideos;
      return findSubCategory;
    }
  }

  async findOneFilter(id: string) {
    const findCategory = await TrainingSubCategoriesEntity.find({
      where: {
        category_id: {
          id: id,
        },
      },
    });
    return findCategory;
  }

  async getfilterUz(title: string) {
    const filterTacticCategory = await TrainingSubCategoriesEntity.find({
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
    const filterTacticCategory = await TrainingSubCategoriesEntity.find({
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

  async create(body: CreateTrainingSubCategoryDto) {
    const findCategory: TrainingCategoriesEntity =
      await TrainingCategoriesEntity.findOneBy({
        id: body.category_id,
      });

    if (!findCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    const findSubCategory = await TrainingSubCategoriesEntity.findOneBy({
      title: body.title,
    });
    if (findSubCategory) {
      throw new HttpException('Alrady add sub Category', HttpStatus.FOUND);
    }

    await TrainingSubCategoriesEntity.createQueryBuilder()
      .insert()
      .into(TrainingSubCategoriesEntity)
      .values({
        category_id: findCategory,
        title: body.title,
        title_ru: body.title_ru,
      })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
      });
  }

  async update(id: string, body: UpdateTrainingSubCategory) {
    const findSubCategory = await TrainingSubCategoriesEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findSubCategory) {
      throw new HttpException('Not found sub Category', HttpStatus.NOT_FOUND);
    }

    const findCategory = await TrainingCategoriesEntity.findOneBy({
      id: body.category_id,
    });

    await TrainingSubCategoriesEntity.createQueryBuilder()
      .update(TrainingSubCategoriesEntity)
      .set({
        category_id: findCategory || findSubCategory.category_id,
        title: body.title || findSubCategory.title,
        title_ru: body.title_ru || findSubCategory.title_ru,
      })
      .where({ id })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async remove(id: string) {
    const findSubCategory = await TrainingSubCategoriesEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Not found Category', HttpStatus.BAD_REQUEST);
    });

    await TrainingSubCategoriesEntity.createQueryBuilder()
      .delete()
      .from(TrainingSubCategoriesEntity)
      .where({ id })
      .execute();
  }
}
