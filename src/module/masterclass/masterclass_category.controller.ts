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
import { MasterClassCategoryServise } from './masterclass_category.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateMasterClassCategoryDto } from './dto/create_masterclassCategory.dto';
import { UpdateMasterclassCategoryDto } from './dto/update_masterclassCategory.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
@Controller('MasterclassCategory')
@ApiTags('MasterclassCategory')
@ApiBearerAuth('JWT-auth')
export class MasterClassCategoryController {
  readonly #_service: MasterClassCategoryServise;
  constructor(service: MasterClassCategoryServise) {
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
        'title_descrioption',
        'title_descrioption_ru',
        'image',
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
        title_descrioption: {
          type: 'string',
          default: 'uuid23422',
        },
        title_descrioption_ru: {
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
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  async create(
    @UploadedFiles()
    file: { image?: Express.Multer.File },
    @Body() createMasterClassCategoryDto: CreateMasterClassCategoryDto,
  ) {
    return await this.#_service.create(
      createMasterClassCategoryDto,
      file.image[0],
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
        title_descrioption: {
          type: 'string',
          default: 'uuid23422',
        },
        title_descrioption_ru: {
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
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image' }]))
  async update(
    @Param('id') id: string,
    @Body() updateMasterclassCategoryDto: UpdateMasterclassCategoryDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File },
  ) {

    await this.#_service.update(
      id,
      updateMasterclassCategoryDto,
      files?.image ? files?.image[0] : null,
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
