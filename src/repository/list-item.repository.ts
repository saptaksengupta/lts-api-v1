import { Repository, EntityRepository } from "typeorm";
import { ListItem, LIST_ITEM_STATUS } from "../entity/ListItem.entity";
import { CreateListItemDto } from "../list-item/dto/createListItem.dto";
import { Board } from "../entity/Board.entity";

@EntityRepository(ListItem)
export class ListItemRepository extends Repository<ListItem> {

    createAndSave(createdBy: number, createListDto: CreateListItemDto, board: Board) {
        const date = new Date();
        const listItem = new ListItem();
        listItem.description = createListDto.description;
        listItem.is_done = LIST_ITEM_STATUS.NOT_DONE;
        listItem.created_at = date.toISOString();
        listItem.updated_at = date.toISOString();
        listItem.last_modified_by = createdBy;

        const listItemToSave = this.create({...listItem, board: board})
        return this.save(listItemToSave);
    }

    updateListitem(listitemInstance: ListItem, modificationDet){
        if(modificationDet.description) {
            listitemInstance.description = modificationDet.description;
            listitemInstance.updated_at = new Date().toISOString();
            listitemInstance.last_modified_by = modificationDet.modifiedBy;
            return this.save(listitemInstance);
        }

        return listitemInstance;
    }

    async deleteListItem(listItemId: number) {
        return this.delete(listItemId);
    }

    async toggleStatus(listitemId: number, modifiedBy: number) {
        const listitem = await this.getListitemById(listitemId);
        listitem.is_done = !listitem.is_done;
        listitem.last_modified_by = modifiedBy;
        listitem.updated_at = new Date().toISOString();
        return this.save(listitem);
    }


    async getListitemById(listitemId: number){
        return this.findOne({id: listitemId});        
    }

    async getListitemWithBoard(listitemId: number) {
        return this.findOne({id: listitemId}, { relations: ["board"] });
    }

}