import {IUser} from "../../../database/types/User";
import {CreateUserDto} from "../dto/create-user.dto";
import { v4 as uuidv4 } from 'uuid';
import {UpdateUserDto} from "../dto/update-user.dto";
import {ForbiddenException} from "@nestjs/common";

export class User {
    private readonly id: string
    private readonly login: string
    private password: string
    private version: number
    private readonly createdAt: number
    private updatedAt: number

    constructor(user: IUser) {
        this.id = user.id
        this.login = user.login
        this.password = user.password
        this.version = user.version
        this.createdAt = user.createdAt
        this.updatedAt = user.updatedAt
    }

    static create(createUserDto: CreateUserDto): User {
        const id = uuidv4()
        const version = 1
        const createdAt = Date.now()
        const updatedAt = createdAt
        return new User({id, version, createdAt, updatedAt, ...createUserDto})
    }

    toObj(exclude?: ['password']): IUser {
        const object = {
            id: this.id,
            login: this.login,
            password: this.password,
            version: this.version,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
        if (exclude?.length) {
            exclude.forEach(key => delete object[key])
        }
        return object
    }

    update(updateUserDto: UpdateUserDto) {
        if (this.password !== updateUserDto.oldPassword) {
            throw new ForbiddenException(`old password is wrong`)
        }
        this.password = updateUserDto.newPassword
        this.version += 1
        this.updatedAt = Date.now()
    }
}
