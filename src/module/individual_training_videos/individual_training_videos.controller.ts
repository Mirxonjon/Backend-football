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
import { IndividualTrainingVideosServise } from './individual_training_videos.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateIndividualTrainingVideosDto } from './dto/create_individual_training_video.dto';
import {  UpdateIndividualTrainingVideosDto } from './dto/update_individual_training_video.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
import { CustomHeaders } from 'src/types';
@Controller('IndividualTrainingVideos')
@ApiTags('Individual Training Videos')
@ApiBearerAuth('JWT-auth')
export class IndividualTrainingVideosController {
  readonly #_service: IndividualTrainingVideosServise;
  constructor(service: IndividualTrainingVideosServise) {
    this.#_service = service;
  }

  // @Get('/allbyCourse/:categoryid')
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // @ApiOkResponse()
  // @ApiHeader({
  //   name: 'access_token',
  //   description: 'User token',
  //   required: false,
  // })
  // async getall(@Param('categoryid') id: string, @Headers() header: CustomHeaders) {
  //   return await this.#_service.getall(id, header);
  // }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({
    name: 'authorization',
    description: 'User token',
    required: false,
  })
  async findOne(@Param('id') id: string, @Headers() header: CustomHeaders) {
    return await this.#_service.findOne(id, header);
  }

  // @UseGuards(jwtGuard)
  // @Get('/filterBySubCategory/:id')
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // @ApiOkResponse()
  // async findBySubCategory(@Param('id') id: string) {
  //   return await this.#_service.findBySubCategory(id);
  // }

  // @UseGuards(jwtGuard)
  // @Get('/all')
  // @ApiBadRequestResponse()
  // @ApiNotFoundResponse()
  // @ApiOkResponse()
  // async findall() {
  //   return await this.#_service.findAll();
  // }

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
      required: [
        'category_id',
        'title',
        'title_ru',
        'duration',
        'sequence',
        'description_tactic',
        'description_tactic_ru',
        'video',
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
        duration: {
          type: 'string',
          default: '9:10m',
        },
        sequence: {
          type: 'number',
          default: 1,
        },
        description_tactic: {
          type: 'string',
          default: 'uuid23422',
        },
        description_tactic_ru: {
          type: 'string',
          default: 'Хорошее обучение',
        },
        video: {
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
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'video' }, { name: 'image' }]),
  )
  async create(
    @UploadedFiles()
    videos: { video?: Express.Multer.File; image?: Express.Multer.File },
    @Body() createIndividualTrainingVideosDto: CreateIndividualTrainingVideosDto,
  ) {
    return await this.#_service.create(
      createIndividualTrainingVideosDto,
      videos.video[0],
      videos.image[0],
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
        duration: {
          type: 'string',
          default: '9:10m',
        },
        sequence: {
          type: 'number',
          default: 1,
        },
        description_tactic: {
          type: 'string',
          default: 'uuid23422',
        },
        description_tactic_ru: {
          type: 'string',
          default: 'Хорошее обучение',
        },
        video: {
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
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'video' }, { name: 'image' }]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateIndividualTrainingVideosDto: UpdateIndividualTrainingVideosDto ,
    @UploadedFiles()
    videos: { video?: Express.Multer.File; image?: Express.Multer.File },
  ) {
    await this.#_service.update(
      id,
      updateIndividualTrainingVideosDto,
      videos?.video ? videos?.video[0] : null,
      videos?.image ? videos?.image[0] : null,
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
