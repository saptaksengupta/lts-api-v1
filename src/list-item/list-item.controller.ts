import { Controller, Post, Body, HttpException, HttpStatus, Put, Param, Req, Get } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ERROR_STRINGS } from 'src/shared/global-strings.constant';
import { ListItemService } from './list-item.service';
import { CreateListItemDto } from './dto/createListItem.dto';
import { BoardService } from 'src/board/board.service';

@Controller('boards/:boardId/list-items/')
export class ListItemController {

    constructor(private userService: UserService, private boardService: BoardService, private listItemService: ListItemService){}

    @Get(":listItemId")
    async getListItemDetails(@Param() params) {
        const boardId = params.boardId;
        const liseItemId = params.listItemId;
        const board = this.boardService.getBoardById(boardId);
        if(!board) {
            throw new HttpException(ERROR_STRINGS.BOARD_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        const listitem = await this.listItemService.getListitemById(liseItemId);
        if(!listitem) {
            throw new HttpException(ERROR_STRINGS.LIST_ITEM_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        return {data: listitem.toResponseObject(), code: HttpStatus.OK};
    }

    @Post()
    async createListItem(@Param() params, @Body() postedListItem: CreateListItemDto) {
        const user = await this.userService.getUserById(postedListItem.userId);
        if (!user) {
            throw new HttpException(ERROR_STRINGS.USER_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        const board = await this.boardService.getBoardById(params.boardId);
        if (!board) {
            throw new HttpException(ERROR_STRINGS.BOARD_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        try {
            const listItem = await this.listItemService.createListItem(user.id, postedListItem, board);   
            return {data: listItem, code: HttpStatus.OK};    
        } catch (error) {
            console.log(error);
            throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.BAD_REQUEST);
        }
    }

    @Put(":listitemId")
    async updateListitemDesc(@Param() params, @Body() listitemDetailsToUpdate) {
        const userId = listitemDetailsToUpdate.userId;
        const boardId = params.boardId;
        const listitemId = params.listitemId;

        const board = this.boardService.getBoardById(boardId);
        if(!board) {
            throw new HttpException(ERROR_STRINGS.BOARD_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        const listitem = await this.listItemService.getListitemById(listitemId);
        if(!listitem) {
            throw new HttpException(ERROR_STRINGS.LIST_ITEM_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        try {
            const listitemResponse = await this.listItemService.updateListitem(listitem, listitemDetailsToUpdate);
            return {data: listitemResponse, code: HttpStatus.OK};
        } catch (error) {
            console.log(error);
            throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(":listitemId/change")
    async changeListitemState(@Param() params, @Body() listitemProps) {
        const modifiedBy = listitemProps.modifiedBy;
        const listitemId = params.listitemId;
        const listitem = this.listItemService.getListitemById(listitemId);
        if(!listitem) {
            throw new HttpException(ERROR_STRINGS.LIST_ITEM_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        try {
            const listitem = await this.listItemService.changeStatus(listitemId, modifiedBy);
            return {data: listitem, code: HttpStatus.OK};
        } catch (error) {
            console.log(error);
            throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
