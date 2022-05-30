import { Controller, Delete, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

export interface StatusResult {
  error: boolean;
  message: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/status')
  getStatus(): StatusResult {
    if (this.appService.isRunning()) {
      return {
        error: false,
        message: 'Up and running',
      };
    } else {
      return {
        error: true,
        message: 'Not running',
      };
    }
  }

  @Get('/output')
  getOutput(): string {
    return this.appService.getStdOut();
  }

  @Post('/start')
  start(): void {
    this.appService.start();
  }

  @Delete('/stop')
  stop(): void {
    this.appService.stop();
  }
}
