import { Injectable } from '@nestjs/common';
import { ListItemRepository } from '../repository/list-item.repository';
import { getCustomRepository } from 'typeorm';
import { CreateListItemDto } from './dto/createListItem.dto';
import { Board } from '../entity/Board.entity';

@Injectable()
export class ListItemService {

    constructor() { }

    async createListItem(userId: number, listitemToCreate: CreateListItemDto, board: Board) {
        const listitemRepository = getCustomRepository(ListItemRepository);
        const createdListItem = await listitemRepository.createAndSave(userId, listitemToCreate, board);
        return createdListItem.toResponseObject();
    }

    async updateListitem(listitemInstance, modificationDet) {
        const listitemRepository = getCustomRepository(ListItemRepository);
        const updatedListItem = await listitemRepository.updateListitem(listitemInstance, modificationDet);
        return updatedListItem.toResponseObject();
    }

    async changeStatus(listItemId: number, modifiedBy: number) {
        const listitemRepository = getCustomRepository(ListItemRepository);
        const changedList = await listitemRepository.toggleStatus(listItemId, modifiedBy);
        return changedList.toResponseObject();
    }

    async getListitemById(listitemId: number, withBoard = false) {
        const listitemRepository = getCustomRepository(ListItemRepository);
        let createdListitem = null;
        if (withBoard) {
            createdListitem = await listitemRepository.getListitemWithBoard(listitemId);
        } else {
            createdListitem = await listitemRepository.getListitemById(listitemId);
        }
        return createdListitem;
    }

    async removeListItem(listItemId: number) {
        const listitemRepository = getCustomRepository(ListItemRepository);
        const deleteResp = await listitemRepository.deleteListItem(listItemId);
        console.log(deleteResp);
        return deleteResp;
    }

}
