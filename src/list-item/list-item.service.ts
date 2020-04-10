import { Injectable } from '@nestjs/common';
import { ListItemRepository } from 'src/repository/list-item.repository';
import { getCustomRepository } from 'typeorm';
import { CreateListItemDto } from './dto/createListItem.dto';

@Injectable()
export class ListItemService {

    constructor() { }

    async createListItem(userId: number, listitemToCreate: CreateListItemDto) {
        const listitemRepository = getCustomRepository(ListItemRepository);
        return await listitemRepository.createAndSave(userId, listitemToCreate);
    }

    async updateListitem(listitemInstance, modificationDet) {
        const listitemRepository = getCustomRepository(ListItemRepository);
        return await listitemRepository.updateListitem(listitemInstance, modificationDet);
    }

    async changeStatus(listItemId: number, modifiedBy: number) {
        const listitemRepository = getCustomRepository(ListItemRepository);
        return await listitemRepository.toggleStatus(listItemId, modifiedBy);
    }

    async getListitemById(listitemId: number) {
        const listitemRepository = getCustomRepository(ListItemRepository);
        return await listitemRepository.getListitemById(listitemId);
    }

}
