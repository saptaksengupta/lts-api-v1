import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';

import {getCustomRepository} from 'typeorm';
import { UserRepository } from '../repository/user.repository';
import { User } from 'src/entity/user.entity';

@Injectable()
export class UserService {

    async createAndSaveUser(userToCreate: CreateUserDto) {
        const userRepository = getCustomRepository(UserRepository);
        return await userRepository.createAndSave(userToCreate);
    }

    async getUserById(userId: number) {
        const userRepository = getCustomRepository(UserRepository);
        return await userRepository.findUserById(userId);
    }

    async getUserByPhone(phone: string){
        const userRepository = getCustomRepository(UserRepository);
        return await userRepository.findUserByPhone(phone);
    }
}
