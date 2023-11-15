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
import { TacticVideosServise } from './tactic_videos.service';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { CreateTacticVideosDto } from './dto/create_tactic_video.dto';
import { UpdateTacticVideosDto } from './dto/update_tactic_video.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
@Controller('tacticVideos')
@ApiTags('Tactic Videos')
@ApiBearerAuth('JWT-auth')
export class TacticVideosController {
  readonly #_service: TacticVideosServise;
  constructor(service: TacticVideosServise) {
    this.#_service = service;
  }
  @Get('/allbyCourse/:categoryid')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({
    name: 'autharization',
    description: 'User token',
    required: false,
  })
  async getall(@Param('categoryid') id: string, @Headers() header: any) {
    return await this.#_service.getall(id, header);
  }

  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @ApiHeader({
    name: 'autharization',
    description: 'User token',
    required: false,
  })
  async findOne(@Param('id') id: string, @Headers() header: any) {
    return await this.#_service.findOne(id, header);
  }

  @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'tactic_id',
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
        tactic_id: {
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
    @Body() createTacticVideo: CreateTacticVideosDto,
  ) {
    return await this.#_service.create(
      createTacticVideo,
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
        tactic_id: {
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
    @Body() updateTacticVideos: UpdateTacticVideosDto,
    @UploadedFiles()
    videos: { video?: Express.Multer.File; image?: Express.Multer.File },
  ) {
    await this.#_service.update(
      id,
      updateTacticVideos,
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