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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TrainingSubCategoriesService } from './training_sub_categories.service';
import { CreateTrainingSubCategoryDto } from './dto/create-training_sub_category.dto';
import { UpdateTrainingSubCategory } from './dto/update-training_sub_category.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
import { CustomHeaders } from 'src/types';

@Controller('trainingSubCategories')
@ApiTags('Training Sub categories')
@ApiBearerAuth('JWT-auth')
export class TrainingSubCategoriesController {
  readonly #_service: TrainingSubCategoriesService;
  constructor(service: TrainingSubCategoriesService) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getall() {
    return await this.#_service.getall();
  }

  // @Get('/filter?')
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // @ApiOkResponse()
  // async getfilter(@Query('age') age: string) {
  //   return await this.#_service.getfilter(age);
  // }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({
    name: 'access_token',
    description: 'UserToken token',
    required: false,
  })
  async findOne(@Param('id') id: string, @Headers() headers: CustomHeaders) {
    return await this.#_service.findOne(id, headers);
  }

  @UseGuards(jwtGuard)
  @Get('/filterByCategory/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOneFilter(@Param('id') id: string) {
    return await this.#_service.findOneFilter(id);
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
      required: ['category_id', 'title', 'title_ru'],
      properties: {
        category_id: {
          type: 'string',
          default: 'safafwaefasdfgesgeqwrgfdqwsdf',
        },
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
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(
    @Body() createTrainingSubCategoryDto: CreateTrainingSubCategoryDto,
  ) {
    return await this.#_service.create(createTrainingSubCategoryDto);
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
          default: 'safafwaefasdfgesgeqwrgfdqwsdf',
        },
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
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateTrainingSubCategory: UpdateTrainingSubCategory,
  ) {
    await this.#_service.update(id, updateTrainingSubCategory);
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
