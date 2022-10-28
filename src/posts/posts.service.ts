import { Posts } from './posts.entity';
import { In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Paginated } from 'src/utils/pagination/paginated';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

export const DEFAULT_PAGE_SIZE = 10;

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) { }

  async findAll(page: number, size: number) {
    const skip = page * size;
    const [posts, count] = await this.postsRepository.findAndCount({
      skip: skip,
      take: size,
      // where: {
      //   Like: true,
      // },
      // order: {
      //   id: {
      //     direction: "DESC"
      //   }
      // },
      relations: {
        likes: true
      }
    });

    const pages = Math.ceil(count / size);

    return new Paginated<Posts>(posts, count, pages, page);
  }

  async findNotApprovedAdmin(q: string, page: number, size: number) {
    const skip = page * size;
    const [posts, count] = await this.postsRepository.findAndCount({
      skip: skip,
      take: size,
      where: {
        isActive: false,
        // id: In([1, 3])
        title: Like(`%${q}%`)
      },
    });

    const pages = Math.ceil(count / size);

    return new Paginated<Posts>(posts, count, pages, page);
  }

  async findById(id: number) {
    const post = await this.postsRepository.findOneBy({ id: id });

    if (!post) {
      throw new HttpException(
        `Post with given id = ${id} not found!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return post;
  }

  create(createDTO: CreatePostDto) {
    const post = this.postsRepository.create({
      ...createDTO,
    });
    return this.postsRepository.save(post);
  }

  async update(id: number, updateDTO: UpdatePostDto) {
    // Return null
    // const _post = this.postsRepository.update(
    //   { id: id },
    //   { ...updateDTO, updatedAt: new Date().toISOString() },
    // );
    const post = await this.postsRepository.findOneBy({ id: id });

    if (!post) {
      throw new HttpException(
        `Post with given id = ${id} not found!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.postsRepository.save({
      ...post,
      ...updateDTO,
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(id: number) {
    await this.postsRepository.delete({ id: id });
  }
}
