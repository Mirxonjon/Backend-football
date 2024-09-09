import { Module } from '@nestjs/common';
import { ShortHistoryController } from './short_history.controller';
import { ShortHistoryServise } from './short_history.service';
import { AuthServise } from '../auth/auth.service';

@Module({
  controllers: [ShortHistoryController],
  providers: [ShortHistoryServise,AuthServise],
})
export class ShortHistoryModule {}
