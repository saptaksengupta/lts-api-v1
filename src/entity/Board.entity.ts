import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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

}
