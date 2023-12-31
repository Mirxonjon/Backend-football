import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BooksServise } from './books.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateBookDto } from './dto/create_book.dto';
import { UpdateBookDto } from './dto/update_book.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
@Controller('Books')
@ApiTags('Book')
@ApiBearerAuth('JWT-auth')
export class BooksController {
  readonly #_service: BooksServise;
  constructor(service: BooksServise) {
    this.#_service = service;
  }


  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall(
  ) {
    return await this.#_service.findAllBooks();
  }

  @Get('/allWithPage?')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findallWithPage(
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.#_service.findAll(pageNumber, pageSize);
  }



  @Get('withCategory/allWithPage/:id?')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findallWithpage(
    @Param('id') id: string,
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.#_service.findAllwithCategory(id ,pageNumber, pageSize);
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({
    name: 'authorization',
    description: 'User token',
    required: false,
  })
  async findOne(@Param('id') id: string, @Headers() header: any) {
    return await this.#_service.findOne(id, header);
  }

  @Get('/filter/uz?')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getfilterUz(@Query('title') title: string , @Query('pageNumber') pageNumber: number,
  @Query('pageSize') pageSize: number) {
    return await this.#_service.getfilterUz(title ,pageNumber ,pageSize);
  }

  @Get('/filter/ru?')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getfilterRu(@Query('title') title: string ,  @Query('pageNumber') pageNumber: number,
  @Query('pageSize') pageSize: number,) {
    return await this.#_service.getfilterRu(title ,pageNumber , pageSize);
  }

  @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'category_id',
        'title',
        'title_ru',
        'description_book',
        'description_book_ru',
        'book_lang',
        'book',
        'image',
      ],
      properties: {
        category_id: {
          type: 'string',
          default: '55cc8c2d-34c1-4ca3-88e0-7b1295875642',
        },
        title: {
          type: 'string',
          default: '1 chi dars',
        },
        title_ru: {
          type: 'string',
          default: '1 chi darsru',
        },
        book_lang: {
          type: 'string',
          default: 'ru',
        },
        description_book: {
          type: 'string',
          default: 'uuid23422',
        },
        description_book_ru: {
          type: 'string',
          default: 'Хорошее обучение',
        },
        book: {
          type: 'string',
          format: 'binary',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'book' }, { name: 'image' }]))
  async create(
    @UploadedFiles()
    books: { book?: Express.Multer.File; image?: Express.Multer.File },
    @Body() createBook: CreateBookDto,
  ) {
    return await this.#_service.create(
      createBook,
      books.book[0],
      books.image[0],
    );
  }

  @UseGuards(jwtGuard)
  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category_id: {
          type: 'string',
          default: '55cc8c2d-34c1-4ca3-88e0-7b1295875642',
        },
        title: {
          type: 'string',
          default: '1 chi dars',
        },
        title_ru: {
          type: 'string',
          default: '1 chi darsru',
        },
        book_lang: {
          type: 'string',
          default: 'ru',
        },
        description_book: {
          type: 'string',
          default: 'uuid23422',
        },
        description_book_ru: {
          type: 'string',
          default: 'Хорошее обучение',
        },

        book: {
          type: 'string',
          format: 'binary',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'book' }, { name: 'image' }]))
  async update(
    @Param('id') id: string,
    @Body() updateBook: UpdateBookDto,
    @UploadedFiles()
    book: { book?: Express.Multer.File; image?: Express.Multer.File },
  ) {
    await this.#_service.update(
      id,
      updateBook,
      book?.book ? book?.book[0] : null,
      book?.image ? book?.image[0] : null,
    );
  }

  @UseGuards(jwtGuard)
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async remove(@Param('id') id: string): Promise<void> {
    await this.#_service.remove(id);
  }
}
