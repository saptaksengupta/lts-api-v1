import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/createBoardDto.dto';
import { getCustomRepository } from 'typeorm';
import { BoardRepository } from 'src/repository/board.repository';
import { Board } from 'src/entity/board.entity';

@Injectable()
export class BoardService {

    private toResponseObject(board: Board) {
        const responseObjet = {
            id: board.id, 
            name: board.name, 
            description: board.description, 
            createdAt: board.created_at,
            status: board.status,
            user: board.user
        }
        return responseObjet;
    }

    async createAndSaveBoard(boardToCreate: CreateBoardDto, user) {
        const boardRepository = getCustomRepository(BoardRepository);
        const createdBoard = await boardRepository.createAndSave(boardToCreate, user);
        return this.toResponseObject(createdBoard);
    }

}
