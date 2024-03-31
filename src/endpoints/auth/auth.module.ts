import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../user/users.module";
import {JwtModule} from "@nestjs/jwt";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "./auth.guard";

@Module({
  imports: [
      UsersModule,
      JwtModule.register({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME },
      })
  ],
  controllers: [AuthController],
  providers: [
      AuthService,
      {
          // make all routes dependent on this guard
          provide: APP_GUARD,
          useClass: AuthGuard,
      },
  ]
})
export class AuthModule {}
