import { Likes } from 'src/likes/likes.entity';
import { Posts } from 'src/posts/posts.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'text', length: 100, unique: true })
    username: string;

    @Column({ type: 'text', length: 160, unique: true })
    email: string;

    @Column({ type: 'text', length: 120, default: "" })
    firstName: string;

    @Column({ type: 'text', length: 120, default: "" })
    lastName: string;

    @Column({ type: 'text', default: "local" }) // 
    provider: string; // enum =>  google, facebook, microsoft account, github, local

    @Column({ type: 'text', length: 60 })
    password: string;

    @Column({ type: 'boolean', default: false })
    confirmed: string;

    @Column({ type: 'datetime', default: new Date().toISOString() })
    createdAt: string;

    @Column({ type: 'datetime', nullable: true })
    updatedAt: string; // "2022.09.23 15:52:15"

    @Column({ type: 'datetime', nullable: true })
    deletedAt: string;

    @OneToMany(() => Posts, (posts) => posts.user)
    posts: Posts[]

    @OneToMany(() => Likes, (likes) => likes.user)
    likes: Likes[]
}
