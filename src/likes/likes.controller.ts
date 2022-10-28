import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { DEFAULT_PAGE_SIZE } from "src/posts/posts.service";
import { CreateLikesDto } from "./dto/create-like-dto";
import { LikesService } from "./likes.service";

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) { }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(0), new ParseIntPipe()) page: number,
    @Query('size', new DefaultValuePipe(DEFAULT_PAGE_SIZE), new ParseIntPipe())
    size: number,
  ) {
    return this.likesService.findAll(page, size);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateLikesDto) {
    return this.likesService.create(body);
  }

  @Delete(':id')
  delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.likesService.delete(id);
  }
}
