import { Controller, Post, Body, HttpException, HttpStatus, Put, Param, Req, Get, Delete } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ERROR_STRINGS, SOCKET_EVENTS } from '../shared/global-strings.constant';
import { ListItemService } from './list-item.service';
import { CreateListItemDto } from './dto/createListItem.dto';
import { BoardService } from '../board/board.service';
import { LtsAppGateway } from '../lts-app.gateway';

@Controller('boards/:boardId/list-items/')
export class ListItemController {

    constructor(
        private userService: UserService,
        private boardService: BoardService,
        private listItemService: ListItemService,
        private ltsGateway: LtsAppGateway
    ) { }

    @Get(":listItemId")
    async getListItemDetails(@Param() params) {
        const boardId = params.boardId;
        const liseItemId = params.listItemId;
        const board = this.boardService.getBoardById(boardId);
        if (!board) {
            throw new HttpException(ERROR_STRINGS.BOARD_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        const listitem = await this.listItemService.getListitemById(liseItemId);
        if (!listitem) {
            throw new HttpException(ERROR_STRINGS.LIST_ITEM_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        return { data: listitem.toResponseObject(), code: HttpStatus.OK };
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
            this.ltsGateway.wss.emit(SOCKET_EVENTS.LIST_ITEM_ADDED, { data: listItem });
            return { data: listItem, code: HttpStatus.OK };
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
        if (!board) {
            throw new HttpException(ERROR_STRINGS.BOARD_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        const listitem = await this.listItemService.getListitemById(listitemId);
        if (!listitem) {
            throw new HttpException(ERROR_STRINGS.LIST_ITEM_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        try {
            const listitemResponse = await this.listItemService.updateListitem(listitem, listitemDetailsToUpdate);
            this.ltsGateway.wss.emit(`${SOCKET_EVENTS.LIST_ITEM_DESC_UPDATED}`, { data: listitemResponse });
            return { data: true, code: HttpStatus.OK };
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
        if (!listitem) {
            throw new HttpException(ERROR_STRINGS.LIST_ITEM_NOT_EXIST_ERR_STR, HttpStatus.BAD_REQUEST);
        }

        try {
            const listitem = await this.listItemService.changeStatus(listitemId, modifiedBy);
            this.ltsGateway.wss.emit(`${SOCKET_EVENTS.LIST_ITEM_STATUS_UPDATED}`, { data: listitem });
            return { data: true, code: HttpStatus.OK };
        } catch (error) {
            console.log(error);
            throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(":listitemId")
    async deleteListItem(@Param() params, @Body() deleteRequestBody) {
        const modifiedBy = deleteRequestBody.modifiedBy;
        const boardId = params.boardId;
        try {
            const listItem = await this.listItemService.getListitemById(params.listitemId);
            try {
                // if (boardId != listItem.board.id) {
                //     console.log(listItem.board.id + '    ' + boardId);
                //     throw new HttpException("You are messed up with the board", HttpStatus.FORBIDDEN);
                // }

                // if (!listItem.board.isOwnedBy(modifiedBy)) {
                //     throw new HttpException("Sorry, Not belongs to you", HttpStatus.FORBIDDEN);
                // }

                const deleteResp = await this.listItemService.removeListItem(params.listitemId);
                if (deleteResp) {
                    this.ltsGateway.wss.emit(`${SOCKET_EVENTS.LIST_ITEM_DELETED}`, {data: params.listitemId});
                    // return { data: true, code: HttpStatus.OK };
                }
            } catch (error) {
                console.log(error);
                throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.INTERNAL_SERVER_ERROR);
                
            }
        } catch (error) {
            throw new HttpException(ERROR_STRINGS.INTERNAL_SERVER_ERR_STR, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
