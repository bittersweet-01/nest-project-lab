import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe,
    Post, Put, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comments.dto';
import { UpdateCommentDto } from './dto/update-comments.dto';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Get()
    getAll(@Query('postId', new ParseIntPipe()) postId: number) {
        return this.commentsService.getAll(postId);
      }

    @Get(":commId")
    getById(@Param('commId', new ParseIntPipe()) commId: number) {
        return this.commentsService.getById(commId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() body: CreateCommentDto) {
        return this.commentsService.create(body);
    }

    @Put(":id")
    @HttpCode(HttpStatus.ACCEPTED)
    update(@Param('id', new ParseIntPipe()) id: number, @Body() body: UpdateCommentDto) {
        return this.commentsService.update(id, body);
    }

    @Delete("admin/:id")
    deleteAdmin(@Param('id', new ParseIntPipe()) id: number) {
        return this.commentsService.delete(id);
    }

    @Delete(":id")
    delete(@Param('id', new ParseIntPipe()) id: number) {
        return this.commentsService.softDelete(id);
    }
}


