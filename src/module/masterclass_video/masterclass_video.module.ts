import { Module } from '@nestjs/common';
import { MasterClassVideoController } from './masterclass_video.controller';
import { MasterClassVideoServise } from './masterclass_video.service';

@Module({
  controllers: [MasterClassVideoController],
  providers: [MasterClassVideoServise],
})
export class MasterClassVideoModule {}
