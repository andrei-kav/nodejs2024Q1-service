import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../../database/database.service';
import { IUser, IUserPayload } from '../../database/types/User';
import { payloadToPlain } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config'
import {LoginDto} from "../auth/dto/login.dto";

@Injectable()
export class UsersService {
  constructor(
      private db: DatabaseService,
      private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<IUser, 'password'>> {
    const hashed = await this.getHashedPassword(createUserDto.password)
    return payloadToPlain(await this.db.user.create({ data: {...createUserDto, password: hashed} }));
  }

  async findAll(): Promise<Array<Omit<IUser, 'password'>>> {
    return (await this.db.user.findMany()).map(payloadToPlain);
  }

  async findOne(id: string): Promise<Omit<IUser, 'password'>> {
    const user = await this.getUserInfo(id);
    return payloadToPlain(user);
  }

  async findAndValidate(loginDto: LoginDto): Promise<IUserPayload> {
    const user = await this.db.user.findUnique({ where: { login: loginDto.login } });
    const isMatch = !!user && await this.validatePasswords(loginDto.password, user.password)
    if (!isMatch) {
      throw new ForbiddenException('login data is not correct')
    }
    return user
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<IUser, 'password'>> {
    const user = await this.getUserInfo(id);

    const isMatch = await this.validatePasswords(updateUserDto.oldPassword, user.password)
    if (!isMatch) {
      throw new ForbiddenException(`old password is wrong`);
    }

    return payloadToPlain(
      await this.db.user.update({
        where: { id },
        data: {
          password: updateUserDto.newPassword,
          version: user.version + 1,
        },
      }),
    );
  }

  async remove(id: string) {
    // get the user to be sure that it exists
    await this.getUserInfo(id);
    await this.db.user.delete({ where: { id } });
  }

  private async getUserInfo(id: string): Promise<IUserPayload> {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`user with id ${id} does not seem to exist`);
    }
    return user;
  }

  private async getHashedPassword(password: string): Promise<string> {
    const salt = this.configService.get('CRYPT_SALT')
    return await bcrypt.hash(password, Number(salt))
  }

  private async validatePasswords(loginPassword: string, existingPassword: string): Promise<boolean> {
    return await bcrypt.compare(loginPassword, existingPassword);
  }
}
