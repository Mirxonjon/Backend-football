import { IsString  ,MaxLength } from "class-validator";

export class UpdateTrainingCategory {
    @IsString()
    @MaxLength(200)
    title: string

    @IsString()
    @MaxLength(200)
    title_ru: string

    @IsString()
    @MaxLength(100)
    traning_for_age : string
    
    @IsString()
    description_training: string

    @IsString()
    description_training_ru: string

}