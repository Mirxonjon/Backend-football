import {
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Query,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create_book.dto';
import { extname } from 'path';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { UpdateBookDto } from './dto/update_book.dto';
import {
  allowedBookFormats,
  allowedImageFormats,
} from 'src/utils/videoAndImageFormat';
import { BooksEntity } from 'src/entities/books.entity';
import { BooksCategoriesEntity } from 'src/entities/books_Categories.entity';
import { Like } from 'typeorm';
import { AuthServise } from '../auth/auth.service';
import { CustomHeaders } from 'src/types';

@Injectable()
export class BooksServise {
  readonly #_authService: AuthServise;
  constructor(authService: AuthServise) {
    this.#_authService = authService;
  }
  async findAllBooks() {

    const allbooks = await BooksEntity.find({
      relations: {
        category_id: true,
      },
      order: {
        create_data : 'desc'
      }
    }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    return allbooks
  }

  async findAll(pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await BooksEntity.findAndCount({
      relations: {
        category_id: true,
      },
      skip: offset,
      take: pageSize,
    }).catch((e) => {
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

  async findAllwithCategory(id :string , pageNumber = 1, pageSize = 10 ) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await BooksEntity.findAndCount({
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
  async findOne(id: string, header: CustomHeaders) {

    const findBook = await BooksEntity.findOneBy({ id }).catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    if (!findBook) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    if (header.authorization) {
      const user = await this.#_authService.verify(header.authorization.split(' ')[1]);
      
      if (user.id) {
        return {
          follow: 'true',
          findBook
        };
      }
    } else {
      findBook.book_link = `fdsfahbs${findBook.book_link}jgfjhfgjhf`;
      return {
        follow: 'false',
        findBook
      };
    }
  }

  async getfilterUz(title: string , pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;

    const [results, total] = await BooksEntity.findAndCount({
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

    const [results, total] = await BooksEntity.findAndCount({
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



  async create(
    body: CreateBookDto,
    book: Express.Multer.File,
    Bookimage: Express.Multer.File,
  ) {
    if (!book) {
      throw new HttpException(
        'video should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }
    if (!Bookimage) {
      throw new HttpException(
        'image should not be empty',
        HttpStatus.NO_CONTENT,
      );
    }

    const findCategory = await BooksCategoriesEntity.findOne({
      where: {
        id: body.category_id,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException(
        'Training Category not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const formatImage = extname(Bookimage?.originalname).toLowerCase();

    const formatBook = extname(book?.originalname).toLowerCase();

    if (allowedImageFormats.includes(formatImage)) {
      if (allowedBookFormats.includes(formatBook)) {
        const linkBook = googleCloud(book);
        const linkImage = googleCloud(Bookimage);

        await BooksEntity.createQueryBuilder()
          .insert()
          .into(BooksEntity)
          .values({
            title: body.title.toLowerCase(),
            title_ru: body.title_ru.toLowerCase(),
            description_book: body.description_book,
            description_book_ru: body.description_book_ru,
            book_lang: body.book_lang,
            book_img: linkImage,
            book_link: linkBook,
            category_id: findCategory,
          })
          .execute()
          .catch((e) => {
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
    body: UpdateBookDto,
    book: Express.Multer.File,
    bookImage: Express.Multer.File,
  ) {
    const findBook = await BooksEntity.findOne({
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
        // Rasm va video o'zgartirishlari
        let book_img = findBook.book_img;
        let book_link = findBook.book_link;

        if (formatImage !== 'Not image') {
          await deleteFileCloud(book_img);
          book_img = googleCloud(bookImage);
        }

        if (formatBook !== 'Not book') {
          await deleteFileCloud(book_link);
          book_link = googleCloud(book);
        }
        
        
        const updatedVideo = await BooksEntity.update(id, {
          title: body.title.toLowerCase() || findBook.title,
          title_ru: body.title_ru.toLowerCase() || findBook.title_ru,
          description_book: body.description_book || findBook.description_book,
          description_book_ru:
            body.description_book_ru || findBook.description_book_ru,
          book_lang: body.book_lang || findBook.book_lang,
          book_img,
          book_link,
          category_id: body.category_id == 'null' ?  (findBook.category_id.id as any) : body.category_id,
        })

        return updatedVideo;
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
    const findBook = await BooksEntity.findOneBy({ id }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findBook) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    const imageLink = await deleteFileCloud(findBook?.book_img);
    const bookLink = await deleteFileCloud(findBook?.book_link);

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

    await BooksEntity.delete({ id });
  }
}
