import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe,
    Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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

    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() body: CreateCommentDto) {
        return this.commentsService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @HttpCode(HttpStatus.ACCEPTED)
    update(@Param('id', new ParseIntPipe()) id: number, @Body() body: UpdateCommentDto) {
        return this.commentsService.update(id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('admin/:id')
    deleteAdmin(@Param('id', new ParseIntPipe()) id: number) {
        return this.commentsService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id', new ParseIntPipe()) id: number) {
        return this.commentsService.softDelete(id);
    }
}


