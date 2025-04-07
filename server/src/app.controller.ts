import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getBaseUrl() {
    return { message: 'Base URL is working!' };
  }
}
