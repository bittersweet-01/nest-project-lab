import { IsNumber } from "class-validator";

export class CreateLikesDto {
    @IsNumber()
    public postId: number
}