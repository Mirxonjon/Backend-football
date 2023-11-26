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
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
  import { MasterClassVideoServise } from './masterclass_video.service';
  import {
    FileFieldsInterceptor,
  } from '@nestjs/platform-express';
  import { CreateMasterClassVideoDto } from './dto/create_masterclassVideo.dto';
  import {  UpdateMasterclassVideoDto } from './dto/update_masterclassVideo.dto';
  import { jwtGuard } from '../auth/guards/jwt.guard';
  @Controller('MasterclassVideo')
  @ApiTags('MasterclassVideo')
  @ApiBearerAuth('JWT-auth')
  export class MasterClassVideoController {
    readonly #_service: MasterClassVideoServise;
    constructor(service: MasterClassVideoServise) {
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
  async findall(@Query('pageNumber') pageNumber: number ,@Query('pageSize') pageSize: number) {
    return await this.#_service.findAll(pageNumber , pageSize);
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
          'description_title',
          'description_title_ru',
          'description_tactic',
          'description_tactic_ru',
          'video',
          'image'
        ],
        properties: {
          category_id: {
            type: 'string',
            default: 'Rafa Benítez',
          },
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
            default: 'uuid23422',
          },
          description_title_ru: {
            type: 'string',
            default: 'Хорошее обучение',
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
      FileFieldsInterceptor([{ name: 'image' } , { name: 'video' }]),
    )
    async create(
      @UploadedFiles()
      files : {  image?: Express.Multer.File , video?: Express.Multer.File },
      @Body() createMasterClassVideoDto: CreateMasterClassVideoDto,
    ) {
      return await this.#_service.create(
        createMasterClassVideoDto,
        files.image[0], 
        files.video[0]
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
            default: 'Rafa Benítez',
          },
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
            default: 'uuid23422',
          },
          description_title_ru: {
            type: 'string',
            default: 'Хорошее обучение',
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
      FileFieldsInterceptor([{ name: 'image' } , { name: 'video' }]),
    )
    async update(
      @Param('id') id: string,
      @Body() updateMasterclassVideoDto: UpdateMasterclassVideoDto,
      @UploadedFiles()
      files: { image?: Express.Multer.File ,  video?: Express.Multer.File  },
    ) {
      
    
      await this.#_service.update(
        id,
        updateMasterclassVideoDto,
        files?.image ? files?.image[0] : null,
        files?.video ? files?.video[0] : null,
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
  