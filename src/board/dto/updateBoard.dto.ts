import { IsNotEmpty, IsString } from "class-validator";

export class UpdateBoardDto {
    
    @IsString()
    name?: string;

    @IsString()
    description?: string;

    @IsString()
    status?: string;

    @IsNotEmpty()
    userId: number;
}