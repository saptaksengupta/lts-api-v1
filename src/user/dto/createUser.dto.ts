import { Length, IsInt, Min, Max, MinLength, IsNotEmpty } from 'class-validator';
export class CreateUserDto {

    @IsNotEmpty()
    @Length(1, 20)
    name: string;

    @IsNotEmpty()
    @MinLength(10)
    phone: number;
}