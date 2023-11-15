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
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TrainingCategoriesService } from './training_categories.service';
import { CreateTrainingCategoryDto } from './dto/create-training_category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateTrainingCategory } from './dto/update-training_category.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
import { CustomHeaders } from 'src/types';

@Controller('trainingCategories')
@ApiTags('Training categories')
@ApiBearerAuth('JWT-auth')
export class TrainingCategoriesController {
  readonly #_service: TrainingCategoriesService;
  constructor(service: TrainingCategoriesService) {
    this.#_service = service;
  }

  @Get('/all') 
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getall() {
    return await this.#_service.getall();
  }

  @Get('/filter?')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getfilter(@Query('age') age: string) {
    return await this.#_service.getfilter(age);
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()

  async findOne( @Param('id') id: string ,  ) {
     return await this.#_service.findOne(id);
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
        'traning_for_age',
        'description_training',
        'image',
      ],
      properties: {
        payload: {
          type: 'string',
          default: 'Texnikani rivojlantirish',
        },
        title: {
          type: 'string',
          default: 'Texnikani rivojlantirish',
        },
        title_ru: {
          type: 'string',
          default: 'Развитие технологий',
        },
        traning_for_age: {
          type: 'string',
          default: '9-10',
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
    @Body() createTrainingCategory: CreateTrainingCategoryDto,
  ) {
    return await this.#_service.create(createTrainingCategory, image);
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
        traning_for_age: {
          type: 'string',
          default: '9-10',
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
    @Body() updateTrainingCategory: UpdateTrainingCategory,
    @UploadedFile() image: Express.Multer.File,
  ) {
    await this.#_service.update(id, updateTrainingCategory, image);
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
