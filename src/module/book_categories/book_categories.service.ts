import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookCategoryDto } from './dto/create-book_category.dto';
import { UpdateBookCategory } from './dto/update-book_category.dto';
import { BooksCategoriesEntity } from 'src/entities/books_Categories.entity';
import { Like } from 'typeorm';
@Injectable()
export class BooksCategoriesService {
  async getall() {
    const allBookCategory = await BooksCategoriesEntity.find().catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return allBookCategory;
  }

  // async findAllWithPage(pageNumber = 1, pageSize = 10) {
  //   const offset = (pageNumber - 1) * pageSize;

  //   const [results, total] = await BooksCategoriesEntity.findAndCount({

  //     skip: offset,
  //     take: pageSize,
  //   });

  //   const totalPages = Math.ceil(total / pageSize);

  //   return {
  //     results,
  //     pagination: {
  //       currentPage: pageNumber,
  //       totalPages,
  //       pageSize,
  //       totalItems: total,
  //     },
  //   };
  // }

  async findOne(id: string) {
    const findCategory: BooksCategoriesEntity =
      await BooksCategoriesEntity.findOne({
        where: {
          id: id,
        },
        relations: {
          books: true,
        },
      });

    if (!findCategory) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return findCategory;
  }

  async getfilterUz(title: string) {
    const filterTacticCategory = await BooksCategoriesEntity.find({
      where: {
        title: Like(`%${title}%`),
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return filterTacticCategory;
  }

  async getfilterRu(title: string) {
    const filterTacticCategory = await BooksCategoriesEntity.find({
      where: {
        title_ru: Like(`%${title}%`),
      },
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return filterTacticCategory;
  }

  async create(body: CreateBookCategoryDto) {
    const findCategory = await BooksCategoriesEntity.findOneBy({
      title: body.title,
    });

    if (findCategory) {
      throw new HttpException(
        'Already created this category',
        HttpStatus.FOUND,
      );
    }
    await BooksCategoriesEntity.createQueryBuilder()
      .insert()
      .into(BooksCategoriesEntity)
      .values({
        title: body.title,
        title_ru: body.title_ru,
      })
      .execute()
      .catch(() => {
        throw new HttpException(
          'Bad Request ,shu yerdan',
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  async update(id: string, body: UpdateBookCategory) {
    const findCategory = await BooksCategoriesEntity.findOneBy({
      id: id,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException('Not found Category', HttpStatus.NOT_FOUND);
    }

    await BooksCategoriesEntity.createQueryBuilder()
      .update(BooksCategoriesEntity)
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
    const findCategory = await BooksCategoriesEntity.findOneBy({
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

    await BooksCategoriesEntity.createQueryBuilder()
      .delete()
      .from(BooksCategoriesEntity)
      .where({ id })
      .execute();
  }
}
