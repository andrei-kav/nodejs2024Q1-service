import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe, Header, Put, HttpCode
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {IUser} from "../../database/types/User";

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @Header('Content-Type', 'application/json')
  create(@Body() createUserDto: CreateUserDto): Omit<IUser, 'password'> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Header('Content-Type', 'application/json')
  findAll(): Array<IUser> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  findOne(@Param('id', ParseUUIDPipe) id: string): IUser {
    return this.usersService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Header('Content-Type', 'application/json')
  update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateUserDto: UpdateUserDto
  ): Omit<IUser, 'password'> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.usersService.remove(id);
  }
}
