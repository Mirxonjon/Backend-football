import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShortBookDto } from './dto/create_book.dto';
import { extname } from 'path';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { UpdateShortBookDto } from './dto/update_book.dto';
import {
  allowedBookFormats,
  allowedImageFormats,
} from 'src/utils/videoAndImageFormat';

import { ShortBookCategoriesEntity } from 'src/entities/short_book_Categories.entity';
import { ShortBooksEntity } from 'src/entities/short_books.entity';
import { Like } from 'typeorm';
import { AuthServise } from '../auth/auth.service';
import { CustomHeaders } from 'src/types';

@Injectable()
export class ShortBooksServise {
  readonly #_authService: AuthServise;
  constructor(authService: AuthServise) {
    this.#_authService = authService;
  }
  async findOne(id: string ,header : CustomHeaders ) {
    const findShortBook = await ShortBooksEntity.findOneBy({ id }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    if (!findShortBook) {
      throw new HttpException('short book not found', HttpStatus.NOT_FOUND);
    }
    // console.log(findShortBook);

    console.log(header ,'22222222222');
    
    if (header.access_token) {
      const user = await this.#_authService.verify(header.access_token);
      console.log(user);
      
      if (user) {
        return {
          follow: 'true',
          findShortBook
        };
      }
    } else {
      findShortBook.short_book_link = `fdsfahbs${findShortBook.short_book_link}jgfjhfgjhf`;
      return {
        follow: 'false',
        findShortBook
      };
    }
  }

  async findAllWithpPage(pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await ShortBooksEntity.findAndCount({
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

  async findAllwithCategory(id :string , pageNumber = 1, pageSize = 10 ) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await ShortBooksEntity.findAndCount({
      where: {
        category_id : {
          id: id
        }
      },
      relations: {
        category_id: true,
      },
      skip: offset,
      take: pageSize,
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });;
  

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


  async getfilterUz(title: string , pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await ShortBooksEntity.findAndCount({
      where: {
        title: Like(`%${title}%`),
      },
      relations: {
        category_id: true,
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

    const [results, total] = await ShortBooksEntity.findAndCount({
      where: {
        title_ru: Like(`%${title}%`),
      },
      relations: {
        category_id: true,
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

  async findAll() {
    const findBooks = await ShortBooksEntity.find({
      relations: {
        category_id :true
      },
      order:{
        create_data :'desc'
      }
    });

    if (!findBooks) {
      throw new HttpException('Books not found', HttpStatus.NOT_FOUND);
    }

    return findBooks;
  }

  async create(
    body: CreateShortBookDto,
    book: Express.Multer.File,
    Bookimage: Express.Multer.File,
  ) {
    if (!book) {
      throw new HttpException(
        'book should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }
    if (!Bookimage) {
      throw new HttpException(
        'image should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    const findCategory = await ShortBookCategoriesEntity.findOne({
      where: {
        id: body.category_id,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    const formatImage = extname(Bookimage?.originalname).toLowerCase();
    const formatBook = extname(book?.originalname).toLowerCase();

    if (allowedImageFormats.includes(formatImage)) {
      if (allowedBookFormats.includes(formatBook)) {
        const linkBook = googleCloud(book);
        const linkImage = googleCloud(Bookimage);

        await ShortBooksEntity.createQueryBuilder()
          .insert()
          .into(ShortBooksEntity)
          .values({
            title: body.title.toLowerCase() ,
            title_ru: body.title_ru.toLowerCase(),
            description_book: body.description_book,
            description_book_ru: body.description_book_ru,
            short_book_lang: body.short_book_lang,
            short_book_img: linkImage,
            short_book_link: linkBook,
            category_id: findCategory,
          })
          .execute()
          .catch(() => {
            throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
          });
      } else {
        throw new HttpException(
          'pdf should  be format pdf , word',
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
    body: UpdateShortBookDto,
    book: Express.Multer.File,
    bookImage: Express.Multer.File,
  ) {
    const findBook = await ShortBooksEntity.findOne({
      where: { id },
      relations: { category_id: true },
      select: { category_id: { id: true } },
    });

    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    let formatImage: string = 'Not image';
    let formatBook: string = 'Not book';

    if (bookImage) {
      formatImage = extname(bookImage.originalname).toLowerCase();
    }
    if (book) {
      formatBook = extname(book.originalname).toLowerCase();
    }

    if (
      allowedImageFormats.includes(formatImage) ||
      formatImage === 'Not image'
    ) {
      if (
        allowedBookFormats.includes(formatBook) ||
        formatBook === 'Not book'
      ) {
        let book_img = findBook.short_book_img;
        let book_link = findBook.short_book_link;

        if (formatImage !== 'Not image') {
          await deleteFileCloud(book_img);
          book_img = googleCloud(bookImage);
        }

        if (formatBook !== 'Not book') {
          await deleteFileCloud(book_link);
          book_link = googleCloud(book);
        }

        const updated = await ShortBooksEntity.update(id, {
          title: body.title.toLowerCase() || findBook.title,
          title_ru: body.title_ru.toLowerCase() || findBook.title_ru,
          description_book: body.description_book || findBook.description_book,
          description_book_ru:
            body.description_book_ru || findBook.description_book_ru,
          short_book_lang: body.short_book_lang || findBook.short_book_lang,
          short_book_img: book_img,
          short_book_link: book_link,
          category_id: body.category_id == 'null' ?  (findBook.category_id.id as any) : body.category_id,
        });

        return updated;
      } else {
        throw new HttpException(
          'Book should be in the format pdf , word',
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
    const findBook = await ShortBooksEntity.findOneBy({ id }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findBook) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    const imageLink = await deleteFileCloud(findBook?.short_book_img);
    const bookLink = await deleteFileCloud(findBook?.short_book_link);

    if (!imageLink) {
      throw new HttpException(
        'The video tactic image  was not deleted',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!bookLink) {
      throw new HttpException(
        'The video tactic video  was not deleted',
        HttpStatus.NOT_FOUND,
      );
    }

    await ShortBooksEntity.delete({ id });
  }
}
