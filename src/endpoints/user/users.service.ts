import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {DatabaseService} from "../../database/database.service";
import {User} from "./entities/user.entity";
import {IUser} from "../../database/types/User";

@Injectable()
export class UsersService {

  constructor(private db: DatabaseService) {
  }

  create(createUserDto: CreateUserDto): Omit<IUser, 'password'> {
    // if (this.db.doesUserExist(createUserDto.login)) {
    //   throw new ForbiddenException(`User ${createUserDto.login} already exists`)
    // }
    const newUser = User.create(createUserDto)
    this.db.addUser(newUser.toObj())
    return newUser.toObj(['password'])
  }

  findAll(): Array<IUser> {
    return this.db.getUsers()
  }

  findOne(id: string): IUser {
    return this.getUserInfo(id)
  }

  update(id: string, updateUserDto: UpdateUserDto): Omit<IUser, 'password'> {
    const user = new User(this.getUserInfo(id))
    user.update(updateUserDto)
    this.db.updateUser(user.toObj())
    return user.toObj(['password'])
  }

  remove(id: string) {
    // get the user to be sure that it exists
    this.getUserInfo(id)
    this.db.deleteUser(id)
  }

  private getUserInfo(id: string): IUser {
    const user = this.db.getUser(id)
    if (!user) {
      throw new NotFoundException(`user with id ${id} does not seem to exist`)
    }
    return user
  }
}
