import { Module } from '@nestjs/common';
import { Comments } from './comments.entity';
import { Posts } from 'src/posts/posts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Comments, Posts])],
    controllers: [CommentsController],
    providers: [CommentsService]
})
export class CommentsModule { }