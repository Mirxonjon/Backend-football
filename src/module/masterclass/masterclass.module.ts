import { Module } from '@nestjs/common';
import { MasterClassController } from './masterclass.controller';
import { MasterClassServise  } from './masterclass.service';

@Module({
  controllers: [MasterClassController],
  providers: [MasterClassServise],
})
export class MasterClassModule {}
