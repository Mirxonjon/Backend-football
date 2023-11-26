import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompetitionVideosDto } from './dto/create_competition_video.dto';

import { UpdateCompetitionVideosDto } from './dto/update_competition_video.dto';

import { CompetitionCategoriesEntity } from 'src/entities/competition_Categories.entity';
import { CompetitionVideosEntity } from 'src/entities/competition_Videos.entity';

@Injectable()
export class  CompetitionVideosServise {
  async getall() {
    const findVideos = await CompetitionVideosEntity.find().catch((e) => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });
    if (!findVideos) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return findVideos
  }

  async findOne(id: string) {


    const findVideo = await CompetitionVideosEntity.findOneBy({ id });

    if (!findVideo) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }
      return findVideo;
  }

  async findAll(pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize;
  
    const [results, total] = await CompetitionVideosEntity.findAndCount({
      relations: {
        category_id: true,
      },
      skip: offset,
      take: pageSize,
    });
  
    const totalPages = Math.ceil(total / pageSize);
  
    return {
      results,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        pageSize,
        totalItems: total,
      },
    };
  }
  

  async create(
    body: CreateCompetitionVideosDto,
  ) {

    const findCategory = await CompetitionCategoriesEntity.findOne({
      where: {
        id: body.tactic_id,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException(
        ' Category not found',
        HttpStatus.NOT_FOUND,
      );
    }

        await CompetitionVideosEntity.createQueryBuilder()
          .insert()
          .into(CompetitionVideosEntity)
          .values({
            title: body.title,
            title_ru: body.title_ru,
            description_video: body.description_video,
            description_video_ru: body.description_video_ru,
            video_link: body.video_link,
            category_id: findCategory,
          })
          .execute()
          .catch((e) => {
            throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
          });
 
    
  }
  async update(
    id: string,
    body: UpdateCompetitionVideosDto,

  ) {
    const findVideo = await CompetitionVideosEntity.findOne({
      where: { id },
      relations: { category_id: true },
      select: { category_id: { id: true } },
    });

    if (!findVideo) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    
    const findCategory = await CompetitionCategoriesEntity.findOne({
      where: {
        id: body.tactic_id,
      },
    }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findCategory) {
      throw new HttpException(
        ' Category not found',
        HttpStatus.NOT_FOUND,
      );
    }

        const updatedVideo = await CompetitionVideosEntity.update(id, {
          title: body.title || findVideo.title,
          title_ru: body.title_ru || findVideo.title_ru,
          description_video:
            body.description_video || findVideo.description_video,
            description_video_ru:
            body.description_video_ru || findVideo.description_video_ru,
          video_link : body.video_link || findVideo.video_link,
          category_id: findCategory || findVideo.category_id,

        });

        return updatedVideo;
    
  }

  async remove(id: string) {
    const findVideo = await CompetitionVideosEntity.findOneBy({ id }).catch(() => {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    });

    if (!findVideo) {
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    }

    await CompetitionVideosEntity.delete({ id });
  }
}
