import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/createBoardDto.dto';
import { getCustomRepository } from 'typeorm';
import { BoardRepository } from 'src/repository/board.repository';
import { Board } from 'src/entity/board.entity';
import { UpdateBoardDto } from './dto/updateBoard.dto';

@Injectable()
export class BoardService {

    private toResponseObject(board: Board, withLists = false) {
        const responseObjet = {
            id: board.id, 
            name: board.name, 
            description: board.description, 
            createdAt: board.created_at,
            updatedAt: board.updated_at,
            status: board.status,
            userDetails: {name: board.user.name, phone: board.user.phone}
        }

        if(withLists) {
            responseObjet['listItems'] = board.listitems;
        }
        return responseObjet;
    }

    public getFormattedBoardResponse(board: Board) {
        return this.toResponseObject(board, true);
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
