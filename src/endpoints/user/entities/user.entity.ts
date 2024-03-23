import {IUser, IUserPayload} from "../../../database/types/User";
import {classToPlain, Exclude, plainToClass, Transform} from "class-transformer";


export class User {

    id: string;

    login: string;

    @Exclude({ toPlainOnly: true })
    password: string;

    version: number;

    @Transform(({ value }) => value.getTime(), { toPlainOnly: true })
    createdAt: Date;

    @Transform(({ value }) => value.getTime(), { toPlainOnly: true })
    updatedAt: Date;
}

function payloadToUser(payload: IUserPayload): User {
    return plainToClass<User, IUserPayload>(User, payload)
}

function userToPlain(user: User): Omit<IUser, "password"> {
    return classToPlain<User>(user) as Omit<IUser, "password">
}

export function payloadToPlain(payload: IUserPayload): Omit<IUser, "password"> {
    const user = payloadToUser(payload)
    return userToPlain(user)
}