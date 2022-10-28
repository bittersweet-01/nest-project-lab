import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCommentDto {
    @IsNumber()
    public postId: number;

    @IsString()
    @MinLength(4)
    public text: string
}