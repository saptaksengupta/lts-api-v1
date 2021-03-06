import { Controller, Post, Body, Res, HttpStatus, HttpException, UsePipes, Get, Query, Req, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { UserService } from './user.service';

import { Request } from 'express';
import { DefaultHttpReturnType } from '../shared/global.type';
import { ERROR_STRINGS } from '../shared/global-strings.constant';

@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() postedUserData: CreateUserDto): Promise<DefaultHttpReturnType> {

        try {
            //Already Validated by the Custom Validation Pipe...
            const user = await this.userService.createAndSaveUser(postedUserData);
            return { data: user, code: HttpStatus.OK };
        } catch (error) {
            console.log(error);
            throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/login')
    async login(@Body() postUserData: any): Promise<DefaultHttpReturnType> {

        const phone = postUserData.phone;
        try {
            const user = await this.userService.getUserByPhone(phone);
            if (!user) {
                postUserData.name = "GUEST";
                return this.create(postUserData);
            }
            return { data: user, code: HttpStatus.OK }
        } catch (error) {
            console.log(error);
            throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/find')
    async getUserByPhone(@Req() request: Request): Promise<DefaultHttpReturnType> {
        const phone = request.query.phone;
        const user = await this.userService.getUserByPhone(phone);

        if (!user) {
            throw new HttpException('User With this Phone Not Found.', HttpStatus.BAD_REQUEST);
        }

        return { data: user, code: HttpStatus.OK };
    }

    @Get('/:userId/boards')
    async getAllBoards(@Param() params) {
        const userId = params.userId;
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new HttpException(ERROR_STRINGS.USER_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        const boards = user.activeBoards();
        return { data: boards, code: HttpStatus.OK };

    }

}
