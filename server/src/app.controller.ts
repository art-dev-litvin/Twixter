import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getBaseUrl() {
    return { message: 'Base URL is working!' };
  }
  @Get('boats')
  getBoats() {
    return this.appService.getBoats();
  }
}
