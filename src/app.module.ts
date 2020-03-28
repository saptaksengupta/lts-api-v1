import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { ListItemsModule } from './list-items/list-items.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, BoardsModule, ListItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
