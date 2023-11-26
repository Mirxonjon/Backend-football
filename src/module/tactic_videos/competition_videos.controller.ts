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
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {  CompetitionVideosServise } from './competition_videos.service';

import { CreateCompetitionVideosDto } from './dto/create_competition_video.dto';
import { UpdateCompetitionVideosDto } from './dto/update_competition_video.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
@Controller('competitionVideos')
@ApiTags('Competition Videos')
@ApiBearerAuth('JWT-auth')
export class  CompetitionVideosController {
  readonly #_service: CompetitionVideosServise;
  constructor(service: CompetitionVideosServise) {
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

  @Get('/allWithPage?')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall(@Query('pageNumber') pageNumber: number ,@Query('pageSize') pageSize: number) {
    return await this.#_service.findAll(pageNumber , pageSize);
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
        'description_video',
        'description_video_ru',
        'video_link',
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

        description_video: {
          type: 'string',
          default: 'uuid23422',
        },
        description_video_ru: {
          type: 'string',
          default: 'Хорошее обучение',
        },
        video_link: {
          type: 'string',
          default: 'Хорошее обучение',
        },
      },
    },
  })
  // @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  
  async create(
    @Body() createTacticVideo: CreateCompetitionVideosDto,
  ) {
    return await this.#_service.create(createTacticVideo);
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

        description_video: {
          type: 'string',
          default: 'uuid23422',
        },
        description_video_ru: {
          type: 'string',
          default: 'Хорошее обучение',
        },
        video_link: {
          type: 'string',
          default: 'Хорошее обучение',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Attendance Punch In' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()

  async update(
    @Param('id') id: string,
    @Body() updateTacticVideos: UpdateCompetitionVideosDto,
  
  ) {
    await this.#_service.update(
      id,
      updateTacticVideos
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
