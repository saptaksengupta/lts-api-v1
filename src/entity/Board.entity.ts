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

    @OneToMany(type => ListItem, listitem => listitem.board, { eager: true, nullable: false, onDelete: 'CASCADE' })
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

    public toResponseObject(withLists = false) {
        const responseObjet = {
            id: this.id, 
            name: this.name, 
            description: this.description, 
            createdAt: this.created_at,
            updatedAt: this.updated_at,
            status: this.status,
            userDetails: {name: this.user.name, phone: this.user.phone}
        }

        if(withLists) {
            responseObjet['listItems'] = this.listitems.map(listitem => listitem.toResponseObject());
        }
        return responseObjet;
    }

}