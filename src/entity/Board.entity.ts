import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from './user.entity';

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20
    })
    name: string;

    @Column({
        length: 160
    })
    description: string;

    @ManyToOne(type => User, user => user.boards)
    user: User;

    @Column({
        type: "datetime"
    })
    created_at: Date;

    @Column({
        type: "datetime"
    })
    updated_at: Date;
}
