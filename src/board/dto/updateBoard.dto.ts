import { IsNotEmpty, IsString, IsOptional, IsInt } from "class-validator";

export class UpdateBoardDto {

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @IsNotEmpty()
    lastModifiedBy: number;
}