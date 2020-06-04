import { EntityRepository, Repository, EntityManager } from "typeorm";
import { User } from "../entity/user.entity";
import { CreateBoardDto } from "../board/dto/createBoardDto.dto";
import { Board } from "../entity/Board.entity";
import { UpdateBoardDto } from "../board/dto/updateBoard.dto";

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

        const board = this.create({ ...boardObj, user: user, listitems: [] })
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
        return this.findOne({ id }, { relations: ["user", "listitems"] });
    }

    findAll() {
        return this.findAll();
    }

}