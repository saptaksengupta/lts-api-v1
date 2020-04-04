import { Controller, Post, Body, UsePipes, HttpException, HttpStatus, Put, Param, Get } from '@nestjs/common';
import { DefaultHttpReturnType } from 'src/shared/global.type';
import { CreateBoardDto } from './dto/createBoardDto.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { BoardService } from './board.service';
import { UserService } from 'src/user/user.service';

//constants
import { ERROR_STRINGS } from '../shared/global-strings.constant';
import { UpdateBoardDto } from './dto/updateBoard.dto';
import { Board } from 'src/entity/board.entity';

@Controller('board')
export class BoardController {

    constructor(private baordService: BoardService, private userService: UserService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async createBoard(@Body() postedBoardData: CreateBoardDto): Promise<DefaultHttpReturnType> {

        const user = await this.userService.getUserById(postedBoardData.userId);
        if (!user) {
            throw new HttpException(ERROR_STRINGS.USER_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        try {
            const createdBoard = await this.baordService.createAndSaveBoard(postedBoardData, user);
            return { data: createdBoard, code: HttpStatus.OK };
        } catch (error) {
            console.log(error);
            throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Put(':boardId')
    @UsePipes(new ValidationPipe())
    async updateBoard(@Param() params, @Body() boardToUpdate: UpdateBoardDto): Promise<DefaultHttpReturnType> {

        const user = await this.userService.getUserById(boardToUpdate.userId);
        if (!user) {
            throw new HttpException(ERROR_STRINGS.USER_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        const boardId = params.boardId;
        const board = await this.baordService.getBoardById(boardId);
        if (!board) {
            throw new HttpException(ERROR_STRINGS.BOARD_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        if (!board.isOwnedBy(user.id)) {
            throw new HttpException("This Board Does Not Belongs To This User At All", HttpStatus.BAD_REQUEST);
        }
        try {
            const updatedBoardDetails = await this.baordService.updateBoard(boardId, boardToUpdate);
            return { data: updatedBoardDetails, code: HttpStatus.OK }
        } catch (error) {
            console.log(error);
            throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
