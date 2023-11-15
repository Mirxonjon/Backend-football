import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersServise } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersServise],
})
export class UsersModule {}
