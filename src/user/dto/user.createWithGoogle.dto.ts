import { IsString } from "class-validator"

export class CreateGoogleUserDto {
    @IsString()
    public email: string;

    @IsString()
    public username: string;

    @IsString()
    public firstName: string;

    @IsString()
    public lastName: string;

    @IsString()
    public password: string;

    @IsString()
    public provider: string;
}