import { Module } from "@nestjs/common";
import { TrainingCategoriesController } from "./training_categories.controller";
import { TrainingCategoriesService } from "./training_categories.service";

@Module({
    controllers : [TrainingCategoriesController] ,
    providers : [TrainingCategoriesService]
})
export class TrainingCategoriesModule {}