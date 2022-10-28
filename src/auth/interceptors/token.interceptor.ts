// import {
//     CallHandler,
//     ExecutionContext,
//     Injectable,
//     NestInterceptor,
// } from '@nestjs/common';
// import type { Response } from 'express';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { User } from 'src/user/user.entity';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class TokenInterceptor implements NestInterceptor {
//     constructor(private readonly authService: AuthService) { }

//     intercept(
//         context: ExecutionContext,
//         next: CallHandler<User>,
//     ): Observable<User> {
//         return next.handle().pipe(
//             map(user => {
//                 const response = context.switchToHttp().getResponse<Response>();
//                 const login = await this.authService.login(user);

//                 response.setHeader('Authorization', `Bearer ${login.access_token}`);
//                 response.cookie('token', login.access_token, {
//                     httpOnly: true,
//                     // signed: true,
//                     sameSite: 'strict',
//                     secure: false, // TODO https
//                 });

//                 return user;
//             }),
//         );
//     }
// }