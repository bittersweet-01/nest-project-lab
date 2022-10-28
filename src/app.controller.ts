import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { PostService } from './posts/posts.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly postsService: PostService
  ) { }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @Render('index')
  async root() {

    const posts = await this.postsService.findAll(0, 9)

    return {
      meta: {
        description: "Test nest app",
        title: "Page - Index",
        keywords: "uznu edu",
        author: "uznu",
      },
      message: 'Template test!',
      posts
    };
  }
}