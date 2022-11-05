import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/user.create.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from 'src/user/dto/user.login.dto';
import { AccessToken } from './interfaces/accessToken';
import { CreateGoogleUserDto } from 'src/user/dto/user.createWithGoogle.dto';
import { passwordGenerate } from 'src/utils/passwordGenerator';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validate(usernameOrEmail: string, pass: string): Promise<User> {
        const user = await this.userService.findByEmailOrUsername(usernameOrEmail);
        if (user && await this.userService.checkPassword(user, pass)) {
            const { password, ...result } = user;
            return result as any;
        }
        return null;
    }

    async login(loginDto: LoginUserDto): Promise<AccessToken> {
        let user: User;
        
        try {
            user = await this.userService.findByEmailOrUsername(loginDto.username);
            
        } catch (err) {
            throw new UnauthorizedException(
                `There isn't any user with email or username: ${loginDto.username}`,
            );
        }

        if (!(await this.userService.checkPassword(user, loginDto.password))) {
            throw new UnauthorizedException(
                `Wrong password`,
            );
        }

        const payload = { username: user.username, userId: user.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(signUp: CreateUserDto): Promise<User> {
        const user = await this.userService.create(signUp);
        const { password, ...result } = user;
        return result as any;
    }

    async googleLogin(req) {
        let user: User;

        try {
            user = await this.userService.findByEmailOrUsername(req.user.email);
            if (!user) {
                throw new Error();
            }
        } catch (err) {
            return this.registerWithGoogle(req);
        }
        const payload = { username: user.username, userId: user.id };

        return {
        access_token: this.jwtService.sign(payload),
        };
    }

    async registerWithGoogle(req): Promise<User> {
        const createDTO: CreateGoogleUserDto = {
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            username: req.user.username, 
            provider: req.user.provider,
            password: passwordGenerate()
        };
        
        const user = await this.userService.create(createDTO);
        return user;
    }    
}