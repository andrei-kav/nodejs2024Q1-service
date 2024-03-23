import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {DatabaseService} from "../../database/database.service";
import {IUser, IUserPayload} from "../../database/types/User";
import {payloadToPlain} from "./entities/user.entity";

@Injectable()
export class UsersService {

  constructor(private db: DatabaseService) {
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<IUser, 'password'>> {
    return payloadToPlain(await this.db.user.create({ data: createUserDto }));
  }

  async findAll(): Promise<Array<Omit<IUser, 'password'>>> {
    return (await this.db.user.findMany()).map(payloadToPlain)
  }

  async findOne(id: string): Promise<Omit<IUser, 'password'>> {
    const user = await this.db.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`user with id ${id} does not seem to exist`)
    }

    return payloadToPlain(user)
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<IUser, 'password'>> {
    const user = await this.getUserInfo(id)

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException(`old password is wrong`)
    }

    return payloadToPlain(await this.db.user.update({
      where: { id },
      data: { password: updateUserDto.newPassword, version: user.version + 1 }
    }));
  }

  async remove(id: string) {
    // get the user to be sure that it exists
    await this.getUserInfo(id)
    await this.db.user.delete({ where: { id } })
  }

  private async getUserInfo(id: string): Promise<IUserPayload> {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`user with id ${id} does not seem to exist`)
    }
    return user
  }
}
