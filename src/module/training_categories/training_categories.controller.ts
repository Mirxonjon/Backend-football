import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiHeader, ApiNotFoundResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TrainingCategoriesService } from "./training_categories.service";
import { CreateTrainingCategoryDto } from "./dto/create-training_category.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('trainingCategories')
@ApiTags('Training categories')
export class TrainingCategoriesController {
    readonly #_service : TrainingCategoriesService
    constructor (service : TrainingCategoriesService) {
        this.#_service = service
    }

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
                'image'
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
              traning_for_age: {
                type: 'string',
                default: '9-10',
              },
              description_training: {
                type: 'Yaxshi mashg\'ulot',
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
    @ApiOperation({summary : 'Attendance Punch In'})
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()  
    @ApiHeader({
      name: 'admin_token',
      description: 'Admin token',
      required: true,
    })
    @UseInterceptors(FileInterceptor('image'))
    async  create(
        // @UploadedFile() image : Express.Multer.File  ,
        @Body() createTrainingCategory: CreateTrainingCategoryDto ) {

    }
}