import { User } from "src/entity/user.entity";

export class CreatedBoardDto {
    //TODO: Needs Modification
    id: number;
    name: string;
    description: string;
    createdAt: string;
    status: string;
    user: User
}