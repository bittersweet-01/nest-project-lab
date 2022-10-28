import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { DataSource } from 'typeorm';
import { root } from './utils/paths';
import { LikesModule } from './likes/likes.module';
import { UserModule } from './user/user.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';


console.info(root);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities,
      logging: true,
      type: 'sqlite',
      synchronize: true,
      database: `${root}/db/db.sqlite`,
    }),
    PostModule,
    LikesModule,
    UserModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
