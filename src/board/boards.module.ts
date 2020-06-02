import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Board } from '../entity/Board.entity';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { User } from '../entity/user.entity';
import { UserService } from '../user/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([Board, User])],
    controllers: [BoardController],
    providers: [BoardService, UserService]
})
export class BoardsModule {}
