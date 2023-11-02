import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTacticCategoryDto } from './dto/create-tactic_category.dto';
import { TrainingCategoriesEntity } from 'src/entities/training_Categories.entity';
import { UpdateTacticCategory } from './dto/update-tactic_category.dto';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { extname } from 'path';
import { TacticCategoriesEntity } from 'src/entities/tactic_Categories.entity';
// import soapRequest from 'easy-soap-request'
@Injectable()
export class TacticCategoriesService {
  async getfilter(body: string) {
    const allTacticCategory = await TacticCategoriesEntity.find({
      where: {
        tactic_categories: body,
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return allTacticCategory;
  }

  async getall() {
    const allTacticCategory = await TacticCategoriesEntity.find().catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return allTacticCategory;
  }

  async findOne(id: string, headers: any) {
    const user_id = 'sdad';
    const findCategory: TacticCategoriesEntity =
      await TacticCategoriesEntity.findOne({
        relations: {
          Tactic_videos: true,
        },
      });

    if (user_id && TrainingCategoriesEntity) {
      const takeCourse = 200;

      // if(takeCourse){
      //   return findCategory
      // } else {
      //   for(let i =0 ;i<=findCategory.Training_videos.length;i++){

      //   }
      // }
    }
  }

  async create(body: CreateTacticCategoryDto, image: Express.Multer.File) {
    if (!image) {
      throw new HttpException(
        'image should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    const findCategory = await TacticCategoriesEntity.findOneBy({
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

      await TacticCategoriesEntity.createQueryBuilder()
        .insert()
        .into(TacticCategoriesEntity)
        .values({
          title: body.title,
          title_ru: body.title_ru,
          tactic_categories: body.tactic_category,
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

  async update(
    id: string,
    body: UpdateTacticCategory,
    image: Express.Multer.File,
  ) {
    const findCategory = await TacticCategoriesEntity.findOneBy({
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

      await TacticCategoriesEntity.createQueryBuilder()
        .update(TacticCategoriesEntity)
        .set({
          title: body.title || findCategory.title,
          title_ru: body.title_ru || findCategory.title_ru,
          tactic_categories:
            body.tactic_category || findCategory.tactic_categories,
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
    const findCategory = await TacticCategoriesEntity.findOneBy({
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

    await TacticCategoriesEntity.createQueryBuilder()
      .delete()
      .from(TacticCategoriesEntity)
      .where({ id })
      .execute();
  }
}
