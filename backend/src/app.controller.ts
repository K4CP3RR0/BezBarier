import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { DatabaseService } from './database/database.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly database: DatabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health/db')
  healthDb() {
    return this.database.ping();
  }
}
