import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '../config';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BoardsModule } from './board/boards.module';
import { ListItemsModule } from './list-item/list-items.module';

import { TransformInterceptor } from './shared/transform.interseptor';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LtsAppGateway } from './lts-app.gateway';
import { DatabaseConfig } from 'database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig
    }),
    UserModule, 
    BoardsModule, 
    ListItemsModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    LtsAppGateway,
  ],
})
export class AppModule { }
