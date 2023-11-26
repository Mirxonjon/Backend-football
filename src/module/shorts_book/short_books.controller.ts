import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
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
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ShortBooksServise } from './short_books.service';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { CreateShortBookDto } from './dto/create_book.dto';
import { UpdateShortBookDto } from './dto/update_book.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
@Controller('ShortBooks')
@ApiTags('Short Books')
@ApiBearerAuth('JWT-auth')
export class ShortBooksController {
  readonly #_service: ShortBooksServise;
  constructor(service: ShortBooksServise) {
    this.#_service = service;
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()

  async findOne(@Param('id') id: string) {
    return await this.#_service.findOne(id);
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findAll() {
    return await this.#_service.findAll();
  }

  @Get('/allWithpage?')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall(@Query('pageNumber') pageNumber: number ,@Query('pageSize') pageSize: number) {
    return await this.#_service.findAllWithpPage(pageNumber , pageSize);
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
        'short_book_lang',
        'short_book',
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
        short_book_lang: {
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
        short_book: {
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
  @UseInterceptors(FileFieldsInterceptor([{ name: 'short_book' }, { name: 'image' }]))
  async create(
    @UploadedFiles()
    files: { short_book?: Express.Multer.File; image?: Express.Multer.File },
    @Body() createShortBook: CreateShortBookDto,
  ) {
    return await this.#_service.create(
      createShortBook,
      files.short_book[0],
      files.image[0],
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
        short_book_lang: {
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

        short_book: {
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

  @UseInterceptors(FileFieldsInterceptor([{ name: 'short_book' }, { name: 'image' }]))
  async update(
    @Param('id') id: string,
    @Body() updateBook: UpdateShortBookDto,
    @UploadedFiles()
    file: { short_book?: Express.Multer.File; image?: Express.Multer.File },
  ) {

    await this.#_service.update(
      id,
      updateBook,
      file?.short_book ? file?.short_book[0] : null,
      file?.image ? file?.image[0] : null,
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
