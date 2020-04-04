import {EntityRepository, Repository, EntityManager} from "typeorm";
import {User} from "../entity/user.entity";
import { CreateUserDto } from '../user/dto/createUser.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    createAndSave(userToCreate: CreateUserDto) {
        const user = new User();
        user.name = userToCreate.name;
        user.phone = userToCreate.phone;
        return this.save(user);
    }

    findUserByPhone(phone: number) {
        return this.findOne({ phone });
    }

    findUserById(id: number) {
        return this.findOne({id}, {relations: ['boards']});
    }

}