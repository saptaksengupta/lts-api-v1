import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Board } from './board.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        length:"10"
    })
    phone: string;

    @Column({
        nullable: true
    })
    image: string;

    @OneToMany(type => Board, board => board.user)
    boards: Board[]
}
