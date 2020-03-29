import { Controller, Post, Body, Res, HttpStatus, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { validateOrReject, validate } from 'class-validator';

@Controller('users')
export class UserController {

    @Post()
    create(@Res() res, @Body() postedUserData: CreateUserDto): any {

        // if(true){
        //     throw new HttpException('Custom Error Message', HttpStatus.BAD_REQUEST);
        // }

        let user = new CreateUserDto();
        user.name = postedUserData.name;
        user.phone = postedUserData.phone;

        validate(user).then(errors => {
            if(errors.length > 0) {
                // TODO: Handle Validation Properly.
            }
        });

        return {data: user, code: HttpStatus.OK};
    }

}
