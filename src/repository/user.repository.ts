import {EntityRepository, Repository, EntityManager} from "typeorm";
import {User} from "../entity/user.entity";
import { CreateUserDto } from '../user/dto/createUser.dto';

@EntityRepository()
export class UserRepository {

    constructor(private manager: EntityManager) {
    }

    createAndSave(userToCreate: CreateUserDto) {
        const user = new User();
        user.name = userToCreate.name;
        user.phone = userToCreate.phone;
        return this.manager.save(user);
    }

    findUserByPhone(phone: string) {
        return this.manager.findOne('User', {phone});
    }

}