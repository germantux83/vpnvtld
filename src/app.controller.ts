import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

export interface StatusResult {
  error: boolean;
  message: string;
}

@Controller('/api/vpn')
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
  start(
    @Param('ipAndPort') ipAndPort: string,
    @Param('user') user: string,
    @Param('otp') otp: string,
  ): void {
    this.appService.ipAndPort = ipAndPort;
    this.appService.user = user;
    this.appService.otp = otp;
    this.appService.start();
  }

  @Delete('/stop')
  stop(): void {
    this.appService.stop();
  }
}
