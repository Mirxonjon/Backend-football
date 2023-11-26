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
import { ShortBooksCategoriesService } from './short_book_categories.service';
import { CreateShortBookCategoryDto } from './dto/create-short_book_category.dto';
import { UpdateShortBookCategory } from './dto/update-short_book_category.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';

@Controller('ShortBooksCategories')
@ApiTags('Short Books categories')
@ApiBearerAuth('JWT-auth')
export class ShortBooksCategoriesController {
  readonly #_service: ShortBooksCategoriesService;
  constructor(service: ShortBooksCategoriesService) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getall() {
    return await this.#_service.getall();
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Param('id') id: string) {
    return await this.#_service.findOne(id);
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
  async create(
    @Body() createShortBookCategory: CreateShortBookCategoryDto,
    @Headers() header: any,
  ) {
    return await this.#_service.create(createShortBookCategory);
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
    @Body() updateShortBookCategory: UpdateShortBookCategory,
  ) {
    return await this.#_service.update(id, updateShortBookCategory);
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
