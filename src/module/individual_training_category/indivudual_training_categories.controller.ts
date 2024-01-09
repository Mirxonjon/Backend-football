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
  UploadedFile,
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
import { IndivudualTrainingCategoriesService } from './indivudual_training_categories.service';
import { CreateIndivudualTrainingCategoryDto } from './dto/create-indivudual_training_category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateIndivudualTrainingCategory } from './dto/update-indivudual_training_category.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';

@Controller('IndividualtrainingCategories')
@ApiTags('Individual Training categories')
@ApiBearerAuth('JWT-auth')
export class IndivudualTrainingCategoriesController {
  readonly #_service: IndivudualTrainingCategoriesService;
  constructor(service: IndivudualTrainingCategoriesService) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getall() {
    return await this.#_service.getall();
  }

  @Get('/allWithPage?')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall(
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.#_service.findAll(pageNumber, pageSize);
  }

  @Get('/filter?')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getfilter(
    @Query('age') age: string,
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.#_service.getfilter(age, pageNumber, pageSize);
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Param('id') id: string) {
    return await this.#_service.findOne(id);
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
        'title',
        'title_ru',
        'traning_for_indivudual',
        'description_training',
        'description_training_ru',
        'image',
      ],
      properties: {
        title: {
          type: 'string',
          default: 'Texnikani rivojlantirish',
        },
        title_ru: {
          type: 'string',
          default: 'Развитие технологий',
        },
        traning_for_indivudual: {
          type: 'string',
          default: 'Texnika',
        },
        description_training: {
          type: "Yaxshi mashg'ulot",
          default: 'uuid',
        },
        description_training_ru: {
          type: 'string',
          default: 'Хорошее обучение',
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
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createIndivudualTrainingCategoryDto: CreateIndivudualTrainingCategoryDto,
  ) {
    return await this.#_service.create(createIndivudualTrainingCategoryDto, image);
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
        traning_for_indivudual: {
          type: 'string',
          default: 'Texnika',
        },
        description_training: {
          type: "Yaxshi mashg'ulot",
          default: 'uuid',
        },
        description_training_ru: {
          type: 'string',
          default: 'Хорошее обучение',
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
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateIndivudualTrainingCategory: UpdateIndivudualTrainingCategory,
    @UploadedFile() image: Express.Multer.File,
  ) {
    await this.#_service.update(id, updateIndivudualTrainingCategory, image);
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
