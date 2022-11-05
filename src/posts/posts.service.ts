import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paginated } from 'src/utils/pagination/paginated';
import { In, Like, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts } from './posts.entity';

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
      //   isActive: true,
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
    return this.findPostOrFail(id);
  }

  async create(createDTO: CreatePostDto) {
    const post = this.postsRepository.create({
      ...createDTO,
    });

    const savedPost = await this.postsRepository.save(post)
    return this.responsePost(savedPost);
  }

  async update(id: number, updateDTO: UpdatePostDto) {
    // Return null
    // const _post = this.postsRepository.update(
    //   { id: id },
    //   { ...updateDTO, updatedAt: new Date().toISOString() },
    // );
    const post = await this.findPostOrFail(id);

    return this.postsRepository.save({
      ...post,
      ...updateDTO,
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(id: number) {
    this.findPostOrFail(id)
    await this.postsRepository.delete({ id: id });
  }


  private responsePost = (posts: Posts) => {
    const { deletedAt, isActive, ...result } = posts;
    return result as any;
  }

  private findPostOrFail = async (id: number): Promise<Posts> => {
    const post = await this.postsRepository.findOneBy({ id: id });

    if (!post) {
      throw new HttpException(
        `Post with given id = ${id} not found!`,
        HttpStatus.NOT_FOUND,
      );
    }

    return post
  }
}