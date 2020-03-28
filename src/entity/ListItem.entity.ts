import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ListItem {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        length: 160
    })
    description: string;

    @Column()
    is_done: boolean;
}
