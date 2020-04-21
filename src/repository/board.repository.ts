import { EntityRepository, Repository, EntityManager } from "typeorm";
import { User } from "../entity/user.entity";
import { CreateUserDto } from '../user/dto/createUser.dto';
import { CreateBoardDto } from "src/board/dto/createBoardDto.dto";
import { Board } from "src/entity/board.entity";
import { UpdateBoardDto } from "src/board/dto/updateBoard.dto";

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {

    createAndSave(boardToCreate: CreateBoardDto, user: User) {
        let boardObj = {
            name: boardToCreate.name,
            description: boardToCreate.description,
            last_modified_by: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const board = this.create({ ...boardObj, user: user })
        return this.save(board);
    }

    updateBoardById(boardId: number, boardToUpdate: UpdateBoardDto) {
        let propertiesToModify = {};
        
        if(boardToUpdate.name) {
            propertiesToModify['name'] = boardToUpdate.name;
        }

        if(boardToUpdate.description){
            propertiesToModify['name'] = boardToUpdate.name;
        }

        if(boardToUpdate.status){
            propertiesToModify['status'] = boardToUpdate.status;
        }
        propertiesToModify['updated_at'] = new Date().toISOString();
        propertiesToModify['last_modified_by'] = boardToUpdate.lastModifiedBy;
        return this.update(boardId, propertiesToModify);
    }

    findBoardById(id: number) {
        return this.findOne({ id }, { relations: ["user"] });
    }

    findAll() {
        return this.findAll();
    }

}