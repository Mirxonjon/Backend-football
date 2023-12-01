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
import { CompetitionCategoriesService } from './competition_categories.service';
import { CreateCompetitionCategoryDto } from './dto/create-tactic_category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateCompetitionCategory } from './dto/update-tactic_category.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';

@Controller('competitionCategories')
@ApiTags('Competition categories')
@ApiBearerAuth('JWT-auth')
export class CompetitionCategoriesController {
  readonly #_service: CompetitionCategoriesService;
  constructor(service: CompetitionCategoriesService) {
    this.#_service = service;
  }

  @Get('/all')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getall() {
    return await this.#_service.getall();
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
  async findall(
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.#_service.findAll(pageNumber, pageSize);
  }

  @UseGuards(jwtGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'title_ru', 'image'],
      properties: {
        title: {
          type: 'string',
          default: 'Texnikani rivojlantirish',
        },
        title_ru: {
          type: 'string',
          default: 'Развитие технологий',
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
    @Body() createTacticCategory: CreateCompetitionCategoryDto,
  ) {
    return await this.#_service.create(createTacticCategory, image);
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
        tactic_category: {
          type: 'string',
          default: '9-10',
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
    @Body() updateTacticCategory: UpdateCompetitionCategory,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.#_service.update(id, updateTacticCategory, image);
  }

  @UseGuards(jwtGuard)
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async remove(@Param('id') id: string): Promise<void> {
    return await this.#_service.remove(id);
  }
}
