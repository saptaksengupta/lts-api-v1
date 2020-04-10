import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { User } from './user.entity';
import { ListItem } from "./ListItem.entity";

export enum BoardStatus {
    DELETED = 'deleted',
    ACTIVE = 'active',
    ARCHIVED = 'archived'
}

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 200
    })
    name: string;

    @Column({
        length: 400
    })
    description: string;

    @ManyToOne(type => User, user => user.boards)
    user: User;

    @OneToMany(type => ListItem, listitem => listitem.board)
    listitems: ListItem[]

    @Column({
        type: "datetime"
    })
    created_at: string;

    @Column({
        type: "datetime"
    })
    updated_at: string;

    @Column()
    last_modified_by: number;

    @Column({
        type: 'enum',
        enum: BoardStatus,
        default: BoardStatus.ACTIVE
    })
    status: BoardStatus;

    public isOwnedBy(userId: number): boolean {
        return this.user.id === userId;
    }

}