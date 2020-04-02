import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from './user.entity';

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

    @Column({
        type: "datetime"
    })
    created_at: string;

    @Column({
        type: "datetime"
    })
    updated_at: string;

    @Column({
        type: 'enum',
        enum: BoardStatus,
        default: BoardStatus.ACTIVE
    })
    status: BoardStatus;

    public ownedBy(userId: number): boolean {
        return this.user.id === userId;
    }

}