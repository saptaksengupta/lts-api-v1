import { IsNotEmpty } from "class-validator";

export class UpdateBoardDto {
    //TODO: Needs Modification
    name?: string;
    description?: string;
    status?: string;

    @IsNotEmpty()
    userId: number;
}