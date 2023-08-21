import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { connectDb } from './config/typeorm';

@Module({
  imports: [ 
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot(connectDb),
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
