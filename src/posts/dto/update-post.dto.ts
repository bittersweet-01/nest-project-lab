import { IsBoolean, IsString } from "class-validator"

export class UpdatePostDto {
  @IsString()
  public title: string
  @IsString()
  public description: string
  @IsBoolean()
  public isActive: boolean
}