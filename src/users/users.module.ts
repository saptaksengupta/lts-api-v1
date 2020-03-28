import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users])]
})
export class UsersModule {}
