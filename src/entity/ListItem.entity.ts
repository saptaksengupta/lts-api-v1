import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Board } from "./board.entity";


export const LIST_ITEM_STATUS = {
    DONE: true,
    NOT_DONE: false
}
@Entity()
export class ListItem {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 300
    })
    description: string;

    @Column()
    is_done: boolean;

    @Column()
    created_at: string;

    @Column()
    updated_at: string;

    @Column()
    last_modified_by: number;

    @ManyToOne(type => Board, board => board.listitems)
    board: Board;
}
