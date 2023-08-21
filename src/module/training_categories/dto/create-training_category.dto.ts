import { IsString ,IsNotEmpty ,MaxLength } from "class-validator";

export class CreateTrainingCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title_ru: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    traning_for_age : string
    
    @IsString()
    @IsNotEmpty()
    description_training: string

    @IsString()
    @IsNotEmpty()
    description_training_ru: string

    
}