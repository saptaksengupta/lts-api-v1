import { Module } from '@nestjs/common';
import { ListItemController } from './list-item.controller';
import { ListItemService } from './list-item.service';
import { UserService } from 'src/user/user.service';
import { BoardService } from 'src/board/board.service';

@Module({
  controllers: [ListItemController],
  providers: [ListItemService, UserService, BoardService]
})
export class ListItemsModule {}
