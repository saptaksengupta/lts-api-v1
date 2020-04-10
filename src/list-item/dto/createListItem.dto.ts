import { IsNotEmpty, IsString, IsInt } from "class-validator";

export class CreateListItemDto {
   
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsInt()
    @IsNotEmpty()
    userId: number;


}