import { Controller, Post, Body, UsePipes, HttpException, HttpStatus, Put, Param, Get, Query, Delete, Logger } from '@nestjs/common';
import { DefaultHttpReturnType } from '../shared/global.type';
import { CreateBoardDto } from './dto/createBoardDto.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { BoardService } from './board.service';
import { UserService } from '../user/user.service';
import { LtsAppGateway } from '../lts-app.gateway';

//constants
import { ERROR_STRINGS, SOCKET_EVENTS } from '../shared/global-strings.constant';
import { UpdateBoardDto } from './dto/updateBoard.dto';

@Controller('boards')
export class BoardController {

    constructor(
        private baordService: BoardService,
        private userService: UserService,
        private ltsGateway: LtsAppGateway
    ) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async createBoard(@Body() postedBoardData: CreateBoardDto): Promise<DefaultHttpReturnType> {

        try {
            const user = await this.userService.getUserById(postedBoardData.userId);
            if (!user) {
                throw new HttpException(ERROR_STRINGS.USER_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
            }

            const createdBoard = await this.baordService.createAndSaveBoard(postedBoardData, user);
            this.ltsGateway.wss.emit(SOCKET_EVENTS.BOARD_ADDED, { data: createdBoard });
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
        let board = await this.baordService.getBoardById(boardId);
        if (!board) {
            throw new HttpException(ERROR_STRINGS.BOARD_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        if (!board.isOwnedBy(user.id)) {
            throw new HttpException("This Board Does Not Belongs To This User At All", HttpStatus.BAD_REQUEST);
        }
        try {
            const updatedBoardDetails = await this.baordService.updateBoard(boardId, boardToUpdate);
            board = await this.baordService.getBoardById(boardId);
            this.ltsGateway.wss.emit(SOCKET_EVENTS.BOARD_UPDATED, { data: board.toResponseObject(true) });
            return { data: updatedBoardDetails, code: HttpStatus.OK }
        } catch (error) {
            console.log(error);
            throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':boardId')
    async deleteBoard(@Param() params, @Body() deleteRequestBody) {
        const modifiedBy = deleteRequestBody.modifiedBy;
        const boardId = params.boardId;
        const board = await this.baordService.getBoardById(boardId);

        if (!board) {
            throw new HttpException(ERROR_STRINGS.BOARD_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        if (!board.isOwnedBy(modifiedBy)) {
            Logger.log(`Invalid User Id ${modifiedBy}`, 'List deletion');
            throw new HttpException("This Board Does Not Belongs To This User At All", HttpStatus.BAD_REQUEST);
        }

        try {
            const deleteResp = await this.baordService.removeBoard(boardId);
            if (deleteResp) {
                this.ltsGateway.wss.emit(`${SOCKET_EVENTS.BOARD_DELETED}`, { data: boardId });
                return { data: true, code: HttpStatus.OK };
            }
        } catch (error) {
            throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(":boardId")
    async getBoardDetailsById(@Param() params, @Query() queryParams: any) {
        const boardId = params.boardId;
        const userId = queryParams.userId;
        try {
            const user = await this.userService.getUserById(userId, false);
            if (!user) {
                throw new HttpException(ERROR_STRINGS.USER_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
            }

            const board = await this.baordService.getBoardById(boardId);
            if (!board) {
                throw new HttpException(ERROR_STRINGS.BOARD_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
            }

            if (!board.isOwnedBy(user.id)) {
                throw new HttpException("This Board Does Not Belongs To This User At All", HttpStatus.BAD_REQUEST);
            }
            return { data: { board: board.toResponseObject(true) }, code: HttpStatus.OK };
        } catch (error) {
            console.log(error);
            throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
