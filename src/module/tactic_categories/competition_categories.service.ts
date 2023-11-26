import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompetitionCategoryDto } from './dto/create-tactic_category.dto';
import { TrainingCategoriesEntity } from 'src/entities/training_Categories.entity';
import { UpdateCompetitionCategory } from './dto/update-tactic_category.dto';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { extname } from 'path';
import { CompetitionCategoriesEntity } from 'src/entities/competition_Categories.entity';
import { Like } from 'typeorm';
// import soapRequest from 'easy-soap-request'
@Injectable()
export class CompetitionCategoriesService {
  async getfilterUz(title: string) {
    const filterTacticCategory = await CompetitionCategoriesEntity.find({
      where: {
        title: Like(`%${title}%`),
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return filterTacticCategory;
  }

  async getfilterRu(title: string) {
    const filterTacticCategory = await CompetitionCategoriesEntity.find({
      where: {
        title_ru: Like(`%${title}%`),
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return filterTacticCategory;
  }

  async getall() {
    const allTacticCategory = await CompetitionCategoriesEntity.find({
      order: {
        create_data: 'desc',
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return allTacticCategory;
  }

  async findOne(id: string) {
    const findCategory: CompetitionCategoriesEntity =
      await CompetitionCategoriesEntity.findOne({
        where: {
          id: id,
        },
        relations: {
          Tactic_videos: true,
        },
      });

    return findCategory;
  }

  async findAll(pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await CompetitionCategoriesEntity.findAndCount({
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

  async create(body: CreateCompetitionCategoryDto, image: Express.Multer.File) {
    if (!image) {
      throw new HttpException(
        'image should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    const findCategory = await CompetitionCategoriesEntity.findOneBy({
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

      await CompetitionCategoriesEntity.createQueryBuilder()
        .insert()
        .into(CompetitionCategoriesEntity)
        .values({
          title: body.title,
          title_ru: body.title_ru,
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
    body: UpdateCompetitionCategory,
    image: Express.Multer.File,
  ) {
    const findCategory = await CompetitionCategoriesEntity.findOneBy({
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

      await CompetitionCategoriesEntity.createQueryBuilder()
        .update(CompetitionCategoriesEntity)
        .set({
          title: body.title || findCategory.title,
          title_ru: body.title_ru || findCategory.title_ru,
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
    const findCategory = await CompetitionCategoriesEntity.findOneBy({
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

    await CompetitionCategoriesEntity.createQueryBuilder()
      .delete()
      .from(CompetitionCategoriesEntity)
      .where({ id })
      .execute();
  }
}
