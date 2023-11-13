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
  import { MasterClassServise } from './masterclass.service';
  import {
    FileFieldsInterceptor,
  } from '@nestjs/platform-express';
  import { CreateMasterClassDto } from './dto/create_masterclass.dto';
  import { UpdateTacticVideosDto } from './dto/update_tactic_video.dto';
  import { jwtGuard } from '../auth/guards/jwt.guard';
  @Controller('Masterclass')
  @ApiTags('Masterclass')
  @ApiBearerAuth('JWT-auth')
  export class MasterClassController {
    readonly #_service: MasterClassServise;
    constructor(service: MasterClassServise) {
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
        required: [
          'title',
          'title_ru',
          'description_title',
          'description_tactic',
          'description_tactic_ru',
          'title_image',
          'image'
        ],
        properties: {
          title: {
            type: 'string',
            default: 'Rafa Benítez',
          },
          title_ru: {
            type: 'string',
            default: 'Rafa Benítez',
          },
          description_title: {
            type: 'string',
            default: 'RAFA BENÍTEZ Valencia, 2001-2004; Liverpool, 2004-2010',
          },
          description_tactic: {
            type: 'string',
            default: 'uuid23422',
          },
          description_tactic_ru: {
            type: 'string',
            default: 'Хорошее обучение',
          },
          title_image: {
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
      FileFieldsInterceptor([{ name: 'title_image' }, { name: 'image' }]),
    )
    async create(
      @UploadedFiles()
      videos: { title_image?: Express.Multer.File; image?: Express.Multer.File },
      @Body() createTacticVideo: CreateMasterClassDto,
      @Headers() header: any,
    ) {
      return await this.#_service.create(
        createTacticVideo,
        videos.title_image[0],
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
          title: {
            type: 'string',
            default: 'Rafa Benítez',
          },
          title_ru: {
            type: 'string',
            default: 'Rafa Benítez',
          },
          description_title: {
            type: 'string',
            default: 'RAFA BENÍTEZ Valencia, 2001-2004; Liverpool, 2004-2010',
          },
          description_tactic: {
            type: 'string',
            default: 'uuid23422',
          },
          description_tactic_ru: {
            type: 'string',
            default: 'Хорошее обучение',
          },
          title_image: {
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
      FileFieldsInterceptor([{ name: 'title_image' }, { name: 'image' }]),
    )
    async update(
      @Param('id') id: string,
      @Headers() header: any,
      @Body() updateTacticVideos: UpdateTacticVideosDto,
      @UploadedFiles()
      images: { title_image?: Express.Multer.File; image?: Express.Multer.File },
    ) {
      // console.log(videos, videos?.title_image);
  
      // await this.VerifyToken.verifyAdmin(header);
      await this.#_service.update(
        id,
        updateTacticVideos,
        images?.title_image ? images?.title_image[0] : null,
        images?.image ? images?.image[0] : null,
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
  