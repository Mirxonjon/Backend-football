import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create_book.dto';
import { TrainingCategoriesEntity } from 'src/entities/training_Categories.entity';
import { extname } from 'path';
import { deleteFileCloud, googleCloud } from 'src/utils/google_cloud';
import { TrainingVideosEntity } from 'src/entities/training_Videos.entity';
import { UpdateBookDto } from './dto/update_book.dto';
import {
  allowedBookFormats,
  allowedImageFormats,
  allowedVideoFormats,
} from 'src/utils/videoAndImageFormat';
import { TakeEntity } from 'src/entities/take.entity';
import { TacticCategoriesEntity } from 'src/entities/tactic_Categories.entity';
import { TacticVideosEntity } from 'src/entities/tactic_Videos.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { BooksEntity } from 'src/entities/books.entity';
import { BooksCategoriesEntity } from 'src/entities/books_Categories.entity';

@Injectable()
export class BooksServise {
  // async getall(category_id :string , header :any){
  //   const userId =  'uuu'
  //   const findCategory = await  TacticCategoriesEntity.findOneBy({id : category_id }).catch(e => {
  //     throw new HttpException(
  //       'Bad request',
  //       HttpStatus.BAD_REQUEST,
  //     );})
  //   if(!findCategory){
  //     throw new HttpException(
  //       'Category not found',
  //       HttpStatus.NOT_FOUND,
  //   )}

  //   const allVideosCategory :any[] = await TacticVideosEntity.find({
  //     where : {
  //       category_id :{
  //         id: findCategory.id
  //       }
  //     },
  //     order: {
  //     sequence : 'ASC'
  //     }
  //   }).catch(e => {
  //     throw new HttpException(
  //       'Bad request',
  //       HttpStatus.BAD_REQUEST,
  //     );})

  //     if(!allVideosCategory){
  //       throw new HttpException(
  //         'Videos not found',
  //         HttpStatus.NOT_FOUND,
  //     )}

  // const allCourseVideos = [...allVideosCategory];

  //     if (userId) {
  //       const userTakeCourse = await UsersEntity.findOneBy({
  //         id: userId
  //       }).catch(() => {
  //         throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
  //       });

  //       // if (userTakeCourse.active) {
  //       //   for (let i = 0; i < allCourseVideos.length; i++) {
  //       //     allCourseVideos[i].video_active = true;
  //       //   }

  //       //   return allCourseVideos;
  //       // } else {
  //       //   for (let i = 0; i < allCourseVideos.length; i++) {
  //       //     if(i>1) {
  //       //       allCourseVideos[i].video_active = false;
  //       //       allCourseVideos[i].link = allCourseVideos[i].video_link
  //       //       .split('')
  //       //       .map((e, i) => (i % 2 ? 'w' + e : e + 's'))
  //       //       .join('');
  //       //     }else {
  //       //     allCourseVideos[i].video_active = true;
  //       //     }
  //       //   }
  //       //   return allCourseVideos;
  //       // }
  //         return allCourseVideos;

  //     } else {
  //       for (let i = 0; i < allCourseVideos.length; i++) {
  //         if(i>1) {
  //           allCourseVideos[i].video_active = false;
  //           allCourseVideos[i].link = allCourseVideos[i].video_link
  //           .split('')
  //           .map((e, i) => (i % 2 ? 'w' + e : e + 's'))
  //           .join('');
  //         }else {
  //         allCourseVideos[i].video_active = false;
  //         }
  //       }
  //       return allCourseVideos;
  //     }
  // }

  async findOne(id: string, header: any) {
    const user_id = false;

    const findBook = await BooksEntity.findOneBy({ id });

    if (!findBook) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    if (user_id) {
      return findBook;
    } else {
      findBook.book_link = `fdsfahbs${findBook.book_link}`;

      return findBook;
    }
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
    // console.log(body.tactic_id);

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
    // console.log(formatBook);

    if (allowedImageFormats.includes(formatImage)) {
      if (allowedBookFormats.includes(formatBook)) {
        const linkBook = googleCloud(book);
        const linkImage = googleCloud(Bookimage);

        await BooksEntity.createQueryBuilder()
          .insert()
          .into(BooksEntity)
          .values({
            title: body.title,
            title_ru: body.title_ru,
            description_book: body.description_book,
            description_book_ru: body.description_book_ru,
            book_lang: body.book_lang,
            book_img: linkImage,
            book_link: linkBook,
            category_id: findCategory,
          })
          .execute()
          .catch((e) => {
            console.log(e);

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
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
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
          title: body.title || findBook.title,
          title_ru: body.title_ru || findBook.title_ru,
          description_book: body.description_book || findBook.description_book,
          description_book_ru:
            body.description_book_ru || findBook.description_book_ru,
          book_lang: body.book_lang || findBook.book_lang,
          book_img,
          book_link,
          category_id: body.category_id || (findBook.category_id.id as any),
        });

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
