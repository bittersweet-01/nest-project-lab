import { Repository } from 'typeorm';
import { Comments } from './comments.entity';
import { Posts } from 'src/posts/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCommentDto } from './dto/update-comments.dto';
import { CreateCommentDto } from './dto/create-comments.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comments)
        private readonly commentsRepository: Repository<Comments>,
        @InjectRepository(Posts)
        private readonly postsRepository: Repository<Posts>,
      ) { }
    
      async getAll(postId: number) {
        const comments =  this.commentsRepository.find({
            where : {
                post: { id: postId }
            },
            relations: {
                post: true
            }
          });
        return comments;
      }

    async getById(id: number) {
        const comment = await this.commentsRepository.findOneBy({ id: id });
    
        if (!comment) {
          throw new HttpException(
            `Comment with given id = ${id} not found!`,
            HttpStatus.NOT_FOUND,
          );
        }
    
        return comment;
    }

    async create(createDTO: CreateCommentDto) {
        const post = await this.postsRepository.findOneBy({ id: createDTO.postId });
    
        if (!post) {
          throw new HttpException(
            `Post with given id = ${createDTO.postId} not found!`,
            HttpStatus.NOT_FOUND,
          );
        }
    
        const comment = this.commentsRepository.create({
          post: { id: createDTO.postId },
          text: createDTO.text,
        });
    
        return this.commentsRepository.save(comment)
    }
    
    async update(id: number, updateDTO: UpdateCommentDto) {
      const comment = await this.commentsRepository.findOneBy({ id: id });
    
      if (!comment) {
        throw new HttpException(
          `Comment with given id = ${id} not found!`,
          HttpStatus.NOT_FOUND,
        );
      }
    
      return this.commentsRepository.save({
        ...comment,
        ...updateDTO,
        updatedAt: new Date().toISOString(),
        });
    }
    
    async delete(id: number) {
        await this.commentsRepository.delete({ id: id });
    }

    async softDelete(id: number) {
      const comment = await this.commentsRepository.findOneBy({ id: id });
    
      if (!comment) {
        throw new HttpException(
          `Comment with given id = ${id} not found!`,
          HttpStatus.NOT_FOUND,
        );
      }
    
      return this.commentsRepository.save({
        ...comment,
        deletedAt: new Date().toISOString(),
        });
  }
}