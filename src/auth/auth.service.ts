import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/user.create.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from 'src/user/dto/user.login.dto';
import { AccessToken } from './interfaces/accessToken';

// @Injectable()
// export class AuthService {
//     constructor(
//         private readonly userService: UserService,
//         private readonly jwtService: JwtService,
//     ) { }

//     async register(signUp: CreateUserDto): Promise<User> {
//         const user = await this.userService.create(signUp);
//         delete user.password;

//         return user;
//     }

//     async login(email: string, password: string): Promise<User> {
//         let user: User;

//         try {
//             user = await this.userService.findByEmailOrUsername(email);
//         } catch (err) {
//             throw new UnauthorizedException(
//                 `There isn't any user with email: ${email}`,
//             );
//         }

//         if (!(await this.userService.checkPassword(user, password))) {
//             throw new UnauthorizedException(
//                 `Wrong password for user with email: ${email}`,
//             );
//         }
//         delete user.password;

//         return user;
//     }

//     async verifyPayload(payload: JwtPayload): Promise<User> {
//         let user: User;

//         try {
//             user = await this.userService.findByEmailOrUsername(payload.sub);
//         } catch (error) {
//             throw new UnauthorizedException(
//                 `There isn't any user with email: ${payload.sub}`,
//             );
//         }
//         delete user.password;

//         return user;
//     }

//     signToken(user: User): string {
//         const payload = {
//             sub: user.email,
//         };

//         return this.jwtService.sign(payload);
//     }
// }



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

    async googleLogin(req): Promise<User>   {
        let user: User;
        if (!req.user) {
          throw new UnauthorizedException('No user from google');
        }
    
        user = req.user;
        delete user.password;
        return user;
    }
}