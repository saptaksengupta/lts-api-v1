import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/createBoardDto.dto';
import { getCustomRepository } from 'typeorm';
import { BoardRepository } from 'src/repository/board.repository';
import { Board } from 'src/entity/board.entity';
import { UpdateBoardDto } from './dto/updateBoard.dto';

@Injectable()
export class BoardService {

    private toResponseObject(board) {
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

    async updateBoard(boardId: number, boardToUpdate: UpdateBoardDto) {
        const boardRepository = getCustomRepository(BoardRepository);
        const updatedBoard = await boardRepository.updateBoardById(boardId, boardToUpdate);
        return {boardId};
    }

    async getBoardById(boardId: number){
        const boardRepository = getCustomRepository(BoardRepository);
        return await boardRepository.findBoardById(boardId);
    }

    async getAllBoards() {
        const boardRepository = getCustomRepository(BoardRepository);
        return await boardRepository.findAll();
    }
}
