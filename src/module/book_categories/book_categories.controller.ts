import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BooksCategoriesService } from './book_categories.service';
import { CreateBookCategoryDto } from './dto/create-book_category.dto';
import { UpdateBookCategory } from './dto/update-book_category.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';

@Controller('BooksCategories')
@ApiTags('Books categories')
@ApiBearerAuth('JWT-auth')
export class BooksCategoriesController {
  readonly #_service: BooksCategoriesService;
  constructor(service: BooksCategoriesService) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getall() {
    return await this.#_service.getall();
  }

  // @Get('/all?')
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // @ApiOkResponse()
  // async findall(@Query('pageNumber') pageNumber: number ,@Query('pageSize') pageSize: number) {
  //   return await this.#_service.findAllWithPage(pageNumber , pageSize);
  // }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({
    name: 'autharization',
    description: 'User token',
    required: false,
  })
  async findOne(@Param('id') id: string) {
    return await this.#_service.findOne(id);
  }

  @Get('/filter/uz?')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getfilterUz(@Query('title') title: string) {
    return await this.#_service.getfilterUz(title);
  }

  @Get('/filter/ru?')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getfilterRu(@Query('title') title: string) {
    return await this.#_service.getfilterRu(title);
  }

  @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'title_ru'],
      properties: {
        title: {
          type: 'string',
          default: 'Texnikani rivojlantirish',
        },
        title_ru: {
          type: 'string',
          default: 'Развитие технологий',
        },
      },
    },
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(@Body() createBookCategory: CreateBookCategoryDto) {
    return await this.#_service.create(createBookCategory);
  }

  @UseGuards(jwtGuard)
  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          default: 'Texnikani rivojlantirish',
        },
        title_ru: {
          type: 'string',
          default: 'Развитие технологий',
        },
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateBookCategory: UpdateBookCategory,
  ) {
    return await this.#_service.update(id, updateBookCategory);
  }

  @UseGuards(jwtGuard)
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async remove(@Param('id') id: string): Promise<void> {
    return await this.#_service.remove(id);
  }
}
