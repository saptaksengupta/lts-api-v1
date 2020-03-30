import { Controller, Post, Body, UsePipes, HttpException, HttpStatus } from '@nestjs/common';
import { DefaultHttpReturnType } from 'src/shared/global.type';
import { CreateBoardDto } from './dto/createBoardDto.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { BoardService } from './board.service';
import { UserService } from 'src/user/user.service';

@Controller('board')
export class BoardController {

    constructor(private baordService: BoardService, private userService: UserService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async createBoard(@Body() postedBoardData: CreateBoardDto): Promise<DefaultHttpReturnType> {

        try {
            const user = await this.userService.getUserById(postedBoardData.userId);
            if (!user) {
                throw new HttpException("User Not Exist.", HttpStatus.BAD_REQUEST);
            }
            const createdBoard = await this.baordService.createAndSaveBoard(postedBoardData, user);
            return { data: createdBoard, code: 200 };
        } catch (error) {
            console.log(error);
            throw new HttpException("Unexpected Error, Please try again.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
