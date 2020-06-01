import { Length, IsInt, Min, Max, MinLength, IsNotEmpty, IsMobilePhone, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator, IsNumberString } from 'class-validator';
import { UserRepository } from '../../repository/user.repository';
import { getCustomRepository } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";

@ValidatorConstraint({async: true})
export class IsUserExistByPhoneConstraint implements ValidatorConstraintInterface {

    async validate(phone: any, args: ValidationArguments) {
        const userRepository = getCustomRepository(UserRepository);
        const user  = await userRepository.findUserByPhone(phone);
        if(user) return false;
        return true;
    }

}

export function IsUniquePhone(validationOptions: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserExistByPhoneConstraint
        });
    }
}

export class CreateUserDto {

    @ApiProperty()  
    @IsNotEmpty()
    @Length(1, 20)
    name: string;

    @ApiProperty()
    @IsNumberString()
    @MinLength(10)
    @IsNotEmpty()
    @IsUniquePhone({message: 'Phone Number $value already exist, Try with another one'})
    phone: string;

}
