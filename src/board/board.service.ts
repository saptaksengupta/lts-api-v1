import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/createBoardDto.dto';
import { getCustomRepository } from 'typeorm';
import { BoardRepository } from '../repository/board.repository';
import { UpdateBoardDto } from './dto/updateBoard.dto';

@Injectable()
export class BoardService {
    
    async createAndSaveBoard(boardToCreate: CreateBoardDto, user) {
        const boardRepository = getCustomRepository(BoardRepository);
        const createdBoard = await boardRepository.createAndSave(boardToCreate, user);
        return createdBoard.toResponseObject(true);
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

    async removeBoard(boardId: number) {
        const boardRepository = getCustomRepository(BoardRepository);
        const deleteResp = await boardRepository.deleteBoard(boardId);
        return deleteResp;
    }
}
