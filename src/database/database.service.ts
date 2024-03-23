import {Injectable} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {

    async onModuleInit() {
        console.log('onModuleInit initted')
        this.$connect()
    }

    constructor() {
        console.log('init database')
        super()
    }
}
