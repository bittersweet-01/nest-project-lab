import { User } from './user.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { Comments } from 'src/comments/comments.entity';
import { Posts } from 'src/posts/posts.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comments, Posts, User])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }
