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
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
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
import { TrainingVideosServise } from './training_videos.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { CreateTrainingVideosDto } from './dto/create_training_video.dto';
import { UpdateTrainingVideosDto } from './dto/update_training_video.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
import { localGuard } from '../auth/guards/local.guard';
import { AuthServise } from '../auth/auth.service';
import { CustomHeaders } from 'src/types';
@Controller('TrainingVideos')
@ApiTags('Training Videos')
export class TrainingVideosController {
  readonly #_service: TrainingVideosServise;
  constructor(service: TrainingVideosServise ) {
    this.#_service = service;
  }


  @Get('/allbyCourse/:categoryid')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({
    name: 'access_token',
    description: 'User token',
    required: false,
  })
  async getall(@Param('categoryid') id: string, @Headers() header: CustomHeaders) {
    return await this.#_service.getall(id, header);
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({
    name: 'access_token',
    description: 'User token',
    required: false,
  })
  async findOne(@Param('id') id: string, @Headers() header: CustomHeaders) {
    console.log('okkkkk');
    
    
    return await this.#_service.findOne(id, header);
  }

  @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'training_id',
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
        training_id: {
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
  @ApiHeader({
    name: 'admin_token',
    description: 'Admin token',
    required: true,
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'video' }, { name: 'image' }]),
  )
  async create(
    @UploadedFiles()
    videos: { video?: Express.Multer.File; image?: Express.Multer.File },
    @Body() createTrainingVideo: CreateTrainingVideosDto,
    @Headers() header: any,
  ) {
    return await this.#_service.create(
      createTrainingVideo,
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
        training_id: {
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
  @ApiHeader({
    name: 'admin_token',
    description: 'Admin token',
    required: true,
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'video' }, { name: 'image' }]),
  )
  async update(
    @Param('id') id: string,
    @Headers() header: any,
    @Body() updateTrainingVideos: UpdateTrainingVideosDto,
    @UploadedFiles()
    videos: { video?: Express.Multer.File; image?: Express.Multer.File },
  ) {
    console.log(videos, videos?.video);

    // await this.VerifyToken.verifyAdmin(header);
    await this.#_service.update(
      id,
      updateTrainingVideos,
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
  @ApiHeader({
    name: 'autharization',
    description: 'Admin token',
    required: true,
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.#_service.remove(id);
  }
}
