import {Body, Controller, Header, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {AuthService, JwtTokens} from "./auth.service";
import {Public} from "./constants";
import {RefreshTokenDto} from "./dto/refresh-token.dto";
import {LoginDto} from "./dto/login.dto";
import {IUser} from "../../database/types/User";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe())
    @Post('login')
    @Header('Content-Type', 'application/json')
    @Public()
    login(@Body() loginDto: LoginDto): Promise<JwtTokens> {
        return this.authService.login(loginDto);
    }

    @UsePipes(new ValidationPipe())
    @Post('signup')
    @Header('Content-Type', 'application/json')
    @Public()
    signup(@Body() signupDto: LoginDto): Promise<Omit<IUser, 'password'>> {
        return this.authService.signup(signupDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    @Header('Content-Type', 'application/json')
    @Public()
    refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<JwtTokens> {
        return this.authService.refresh(refreshTokenDto);
    }
}
