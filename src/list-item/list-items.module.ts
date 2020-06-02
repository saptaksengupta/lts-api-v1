import { Module } from '@nestjs/common';
import { ListItemController } from './list-item.controller';
import { ListItemService } from './list-item.service';
import { UserService } from '../user/user.service';
import { BoardService } from '../board/board.service';
import { LtsAppGateway } from '../lts-app.gateway';

@Module({
  controllers: [ListItemController],
  providers: [ListItemService, UserService, BoardService, LtsAppGateway]
})
export class ListItemsModule {}
