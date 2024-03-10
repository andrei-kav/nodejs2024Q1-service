import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {DatabaseService} from "./database/database.service";

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly ds: DatabaseService) {}

  @Get()
  getHello(): string {
    console.log('users', this.ds.getUsers())
    return this.appService.getHello();
  }
}
