import { EntityRepository, Repository, EntityManager } from "typeorm";
import { User } from "../entity/user.entity";
import { CreateUserDto } from '../user/dto/createUser.dto';
import { CreateBoardDto } from "src/board/dto/createBoardDto.dto";
import { Board } from "src/entity/board.entity";

@EntityRepository()
export class BoardRepository {

    constructor(private manager: EntityManager) {
    }

    createAndSave(boardToCreate: CreateBoardDto, user: User) {
        let boardObj = {
            name: boardToCreate.name,
            description: boardToCreate.description,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const board = this.manager.create(Board, { ...boardObj, user: user })
        return this.manager.save(board);
    }

    findBoardById(id: number) {
        return this.manager.findOne('Board', { id });
    }

}