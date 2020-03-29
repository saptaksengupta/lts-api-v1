import { Controller, Post, Body, Res, HttpStatus, HttpException, UsePipes, Get, Query, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { UserService } from './user.service';

import {Request} from 'express';


export class DefaultReturnType {
    data: any;
    code: number
}

@Controller('users')
export class UserController {

    constructor(private userService: UserService){}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Res() res, @Body() postedUserData: CreateUserDto): Promise<DefaultReturnType> {

        //Already Validated by the Custom Validation Pipe...
        const user = await this.userService.createAndSaveUser(postedUserData);
        return {data: user, code: HttpStatus.OK};

    }

    @Get('/find')
    async getUserByPhone(@Req() request: Request) : Promise<DefaultReturnType> {
        const phone = request.query.phone;
        const user = await this.userService.getUserByPhone(phone);

        if(!user) {
            throw new HttpException('User With this Phone Not Found.', HttpStatus.BAD_REQUEST);    
        }
        
        return {data: user, code: HttpStatus.OK};
    }

}
