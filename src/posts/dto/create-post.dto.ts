import { /*IsOptional,*/ IsString } from "class-validator"

export class CreatePostDto {
    @IsString({ message: "Title field is required!" })
    public title: string
    @IsString()
    // @IsOptional()
    public description: string
}