const bcrypt = require('bcrypt');
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user.create.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>) {
    }

    async create(createDTO: CreateUserDto) {

        if (createDTO.password !== createDTO.confirmPassword) {
            throw new BadRequestException("Confirm password not match")
        }


        const user = await this.userRepository.find({
            where: [
                { email: createDTO.email },
                { username: createDTO.username }
            ]
        })


        if (!user) {
            throw new BadRequestException("Email or username already taken!")
        }

        /**
         * This regex will enforce these rules:
            At least one upper case English letter
            At least one lower case English letter
            At least one digit
            At least one special character
            Minimum eight in length
         */
        if (!/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(createDTO.password)) {
            throw new BadRequestException("Password doesnt match the pattern!")
        }

        const hashedPassword = await bcrypt.hash(createDTO.password, 10);

        const newUser = this.userRepository.create({
            email: createDTO.email,
            password: hashedPassword,
            username: createDTO.username,
        })

        const savedUser = await this.userRepository.save(newUser)
        delete savedUser.password
        return savedUser;
    }

    checkPassword(user: User, plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, user.password);
    }

    findByEmailOrUsername(emailOrUserName: string) {
        return this.userRepository.findOne({
            where: [
                { email: emailOrUserName },
                { username: emailOrUserName }
            ]
        })
    }
}
