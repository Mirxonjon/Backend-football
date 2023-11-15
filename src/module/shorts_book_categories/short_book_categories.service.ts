import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {  CreateShortBookCategoryDto } from './dto/create-short_book_category.dto';
import {  UpdateShortBookCategory } from './dto/update-short_book_category.dto';
import { ShortBookCategoriesEntity } from 'src/entities/short_book_Categories.entity';
@Injectable()
export class ShortBooksCategoriesService {

  async getall() {
    const allShortBookCategory = await ShortBookCategoriesEntity.find().catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return allShortBookCategory;
  }

  async findOne(id: string) {
    const findCategory: ShortBookCategoriesEntity =
      await ShortBookCategoriesEntity.findOne({
        where: {
          id: id,
        },
        relations: {
          short_books: true,
        },
      });

      if (!findCategory) {
        throw new HttpException(
          'Not found',
          HttpStatus.NOT_FOUND,
        );
      }

    return findCategory;
  }

  async create(body: CreateShortBookCategoryDto) {
    const findCategory = await ShortBookCategoriesEntity.findOneBy({
      title: body.title,
    });

    if (findCategory) {
      throw new HttpException(
        'Already created this category',
        HttpStatus.FOUND,
      );
    }
    await ShortBookCategoriesEntity.createQueryBuilder()
      .insert()
      .into(ShortBookCategoriesEntity)
      .values({
        title: body.title,
        title_ru: body.title_ru,
      })
      .execute()
      .catch(() => {
        throw new HttpException(
          'Bad Request ',
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async update(id: string, body: UpdateShortBookCategory) {
    const findCategory = await ShortBookCategoriesEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
    }

    await ShortBookCategoriesEntity.createQueryBuilder()
      .update(ShortBookCategoriesEntity)
      .set({
        title: body.title || findCategory.title,
        title_ru: body.title_ru || findCategory.title_ru,
      })
      .where({ id })
      .execute()
      .catch(() => {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      });
  }

  async remove(id: string) {
    const findCategory = await ShortBookCategoriesEntity.findOneBy({
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

    await ShortBookCategoriesEntity.createQueryBuilder()
      .delete()
      .from(ShortBookCategoriesEntity)
      .where({ id })
      .execute();
  }
}
