import { Posts } from './posts.entity';
import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Posts])],
  controllers: [PostsController],
  providers: [PostService],
})
export class PostModule {}
