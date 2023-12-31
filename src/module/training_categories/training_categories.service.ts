import { AuthServise } from './../auth/auth.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrainingCategoryDto } from './dto/create-training_category.dto';
import { TrainingCategoriesEntity } from 'src/entities/training_Categories.entity';
import { UpdateTrainingCategory } from './dto/update-training_category.dto';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { extname } from 'path';
import { CustomHeaders } from 'src/types';
import { Like } from 'typeorm';

// import soapRequest from 'easy-soap-request'
@Injectable()
export class TrainingCategoriesService {
  readonly #_authService: AuthServise;
  constructor(authService: AuthServise) {
    this.#_authService = authService;
  }
  async getfilter(age: string, pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await TrainingCategoriesEntity.findAndCount({
      where: {
        traning_for_age: age,
      },
      skip: offset,
      take: pageSize,
    }).catch((e) => {
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

  async findAll(pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await TrainingCategoriesEntity.findAndCount({
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

  async getall() {
    const allTrainingCategory = await TrainingCategoriesEntity.find().catch(
      (e) => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      },
    );

    return allTrainingCategory;
  }

  async findOne(id: string) {
    const findCategory: any = await TrainingCategoriesEntity.findOne({
      where: {
        id: id,
      },
      relations: {
        Training_sub_category: true,
      },
      order: {
        Training_sub_category: {
          create_data: 'desc',
        },
      },
    });
    return findCategory;
    // let allCourseVideos= [...findCategory.Training_videos]

    // if(header.access_token){

    //   const user  = await this.#_authService.verify(header.access_token)

    //   if (user.id && TrainingCategoriesEntity) {
    //     for (let i : number = 0; i < allCourseVideos.length; i++) {
    //         allCourseVideos[i].active = true
    //         allCourseVideos[i].link = allCourseVideos[i].video_link
    //     }
    //     return findCategory;
    //   } else {
    //     for (let i : number = 0; i < allCourseVideos.length; i++) {
    //       if(i => 2) {
    //         allCourseVideos[i].active = false
    //         allCourseVideos[i].video_link.split()
    //         allCourseVideos[i].link = allCourseVideos[i].video_link
    //           .split('')
    //           .map((e, i) => (i % 2 ? 'w' + e : e + 's'))
    //           .join('');
    //       } else {
    //         allCourseVideos[i].active = true
    //         allCourseVideos[i].link = allCourseVideos[i].video_link
    //       }
    //     }
    //     findCategory.Training_videos = allCourseVideos
    //     return findCategory
    //   }
    //   // return findCategory;
    // } else {
    //   for (let i : number = 0; i < allCourseVideos.length; i++) {
    //     if(i => 2) {
    //       allCourseVideos[i].active = false
    //       allCourseVideos[i].video_link.split()
    //       allCourseVideos[i].link = allCourseVideos[i].video_link
    //         .split('')
    //         .map((e, i) => (i % 2 ? 'w' + e : e + 's'))
    //         .join('');
    //     } else {
    //       allCourseVideos[i].active = true
    //       allCourseVideos[i].link = allCourseVideos[i].video_link
    //     }
    //   }
    //   findCategory.Training_videos = allCourseVideos
    //   return findCategory
    // }
  }

  async create(body: CreateTrainingCategoryDto, image: Express.Multer.File) {
    if (!image) {
      throw new HttpException(
        'image should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    const findCategory = await TrainingCategoriesEntity.findOneBy({
      title: body.title,
    });

    if (findCategory) {
      throw new HttpException(
        'Already created this category',
        HttpStatus.FOUND,
      );
    }
    const formatImage = extname(image.originalname).toLowerCase();
    if (
      formatImage == '.jpg' ||
      formatImage == '.png' ||
      formatImage == '.jpeg' ||
      formatImage == '.pnmj' ||
      formatImage == '.svg'
    ) {
      const link = googleCloud(image);

      await TrainingCategoriesEntity.createQueryBuilder()
        .insert()
        .into(TrainingCategoriesEntity)
        .values({
          title: body.title.toLowerCase(),
          title_ru: body.title_ru.toLowerCase(),
          traning_for_age: body.traning_for_age,
          description_training: body.description_training,
          description_training_ru: body.description_training_ru,
          image: link,
        })
        .execute()
        .catch(() => {
          throw new HttpException(
            'Bad Request ,shu yerdan',
            HttpStatus.BAD_REQUEST,
          );
        });
    } else {
      throw new HttpException(
        'image should  be format jpg , png , jpeg , pnmj , svg',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getfilterUz(title: string, pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await TrainingCategoriesEntity.findAndCount({
      where: {
        title: Like(`%${title}%`),
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

  async getfilterRu(title: string, pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await TrainingCategoriesEntity.findAndCount({
      where: {
        title_ru: Like(`%${title}%`),
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

  async update(
    id: string,
    body: UpdateTrainingCategory,
    image: Express.Multer.File,
  ) {
    const findCategory = await TrainingCategoriesEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
    }
    let formatImage: string = 'Not image';

    if (image) {
      formatImage = extname(image?.originalname).toLowerCase();
    }

    if (
      formatImage == 'Not image' ||
      formatImage == '.jpg' ||
      formatImage == '.png' ||
      formatImage == '.jpeg' ||
      formatImage == '.pnmj' ||
      formatImage == '.svg'
    ) {
      formatImage == 'Not image'
        ? false
        : await deleteFileCloud(findCategory.image);
      const link = formatImage == 'Not image' ? false : googleCloud(image);

      await TrainingCategoriesEntity.createQueryBuilder()
        .update(TrainingCategoriesEntity)
        .set({
          title: body.title.toLowerCase() || findCategory.title,
          title_ru: body.title_ru.toLowerCase() || findCategory.title_ru,
          traning_for_age: body.traning_for_age || findCategory.traning_for_age,
          description_training:
            body.description_training || findCategory.description_training,
          description_training_ru:
            body.description_training_ru ||
            findCategory.description_training_ru,
          image: link || findCategory.image,
        })
        .where({ id })
        .execute()
        .catch(() => {
          throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
        });
    } else {
      throw new HttpException(
        'image should  be format jpg , png , jpeg , pnmj , svg',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const findCategory = await TrainingCategoriesEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Not found Category', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException(
        'Training Category not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const imageLink = await deleteFileCloud(findCategory.image);

    if (!imageLink) {
      throw new HttpException(
        'The category image was not deleted',
        HttpStatus.NOT_FOUND,
      );
    }

    await TrainingCategoriesEntity.createQueryBuilder()
      .delete()
      .from(TrainingCategoriesEntity)
      .where({ id })
      .execute();
  }
}
