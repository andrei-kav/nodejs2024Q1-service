import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../../database/types/User';

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    // to avoid circular dependency
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<JwtTokens> {
    const user = await this.usersService.findAndValidate(loginDto);
    return await this.toJwtPayload(user);
  }

  async signup(signupDto: CreateUserDto): Promise<Omit<IUser, 'password'>> {
    return await this.usersService.create(signupDto);
  }

  async refresh(refreshDto: RefreshTokenDto): Promise<JwtTokens> {
    const refreshToken = refreshDto.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    let login;
    let userId;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
      });
      login = payload.login;
      userId = payload.userId;
    } catch (error) {
      // do not do anything
    }
    if (!login || !userId) {
      throw new ForbiddenException();
    }

    const user = await this.usersService.findOne(userId);

    if (user.login !== login) {
      throw new BadRequestException();
    }

    return await this.toJwtPayload(user);
  }

  private async toJwtPayload(user: Record<string, any>): Promise<JwtTokens> {
    const payload = { userId: user.id, login: user.login };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME'),
        secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
      }),
    };
  }
}
