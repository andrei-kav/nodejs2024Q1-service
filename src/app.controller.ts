import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {DatabaseService} from "./database/database.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
