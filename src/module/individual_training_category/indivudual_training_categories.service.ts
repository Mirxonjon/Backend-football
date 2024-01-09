import { AuthServise } from '../auth/auth.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateIndivudualTrainingCategoryDto } from './dto/create-indivudual_training_category.dto';
import { TrainingCategoriesEntity } from 'src/entities/training_Categories.entity';
import { UpdateIndivudualTrainingCategory } from './dto/update-indivudual_training_category.dto';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { extname } from 'path';
import { Like } from 'typeorm';
import { IndividualTrainingCategoriesEntity } from 'src/entities/individual_training_category';

@Injectable()
export class IndivudualTrainingCategoriesService {
  readonly #_authService: AuthServise;
  constructor(authService: AuthServise) {
    this.#_authService = authService;
  }
  async getfilter(indivudual: string, pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await IndividualTrainingCategoriesEntity.findAndCount({
      where: {
        traning_for_indivudual: indivudual,
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

    const [results, total] = await IndividualTrainingCategoriesEntity.findAndCount({
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
    const allTrainingCategory = await IndividualTrainingCategoriesEntity.find({
      relations: {
        videos: true
      }
    }).catch(
      (e) => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      },
    );

    return allTrainingCategory;
  }

  async findOne(id: string) {
    const findCategory: any = await IndividualTrainingCategoriesEntity.findOne({
      where: {
        id: id,
      },
      relations: {
        videos: true,
      },
      order: {
        videos: {
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

  async getfilterUz(title: string, pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await IndividualTrainingCategoriesEntity.findAndCount({
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

    const [results, total] = await IndividualTrainingCategoriesEntity.findAndCount({
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

  async create(body: CreateIndivudualTrainingCategoryDto, image: Express.Multer.File) {
    if (!image) {
      throw new HttpException(
        'image should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    const findCategory = await IndividualTrainingCategoriesEntity.findOneBy({
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

      await IndividualTrainingCategoriesEntity.createQueryBuilder()
        .insert()
        .into(IndividualTrainingCategoriesEntity)
        .values({
          title: body.title.toLowerCase(),
          title_ru: body.title_ru.toLowerCase(),
          traning_for_indivudual: body.traning_for_indivudual,
          description_training: body.description_training,
          description_training_ru: body.description_training_ru,
          image: link,
        })
        .execute()
        .catch(() => {
          throw new HttpException(
            'Bad Request',
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



  async update(
    id: string,
    body: UpdateIndivudualTrainingCategory,
    image: Express.Multer.File,
  ) {
    const findCategory = await IndividualTrainingCategoriesEntity.findOneBy({
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

      await IndividualTrainingCategoriesEntity.createQueryBuilder()
        .update(IndividualTrainingCategoriesEntity)
        .set({
          title: body.title.toLowerCase() || findCategory.title,
          title_ru: body.title_ru.toLowerCase() || findCategory.title_ru,
          traning_for_indivudual: body.traning_for_indivudual || findCategory.traning_for_indivudual,
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
    const findCategory = await IndividualTrainingCategoriesEntity.findOneBy({
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
    console.log(imageLink);
    

    if (!imageLink) {
      throw new HttpException(
        'The category image was not deleted',
        HttpStatus.NOT_FOUND,
      );
    } 
  
    

    await IndividualTrainingCategoriesEntity.createQueryBuilder()
      .delete()
      .from(IndividualTrainingCategoriesEntity)
      .where({ id })
      .execute();
  }
}
