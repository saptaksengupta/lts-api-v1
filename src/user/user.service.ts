import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';

import {getCustomRepository} from 'typeorm';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {

    private userRepository: UserRepository;

    async createAndSaveUser(userToCreate: CreateUserDto) {
        const userRepository = getCustomRepository(UserRepository);
        return await userRepository.createAndSave(userToCreate);
    }

    async getUserByPhone(phone: string){
        const userRepository = getCustomRepository(UserRepository);
        return await userRepository.findUserByPhone(phone);
    }
}
