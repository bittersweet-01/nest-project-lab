import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/posts/posts.entity';
import { LikesController } from './likes.controller';
import { Likes } from './likes.entity';
import { LikesService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Likes, Posts])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule { }
