import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserController } from './user.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User])],
    controllers: [UserController]
})
export class UserModule {}