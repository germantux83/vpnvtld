import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AppService } from './app.service';

export interface StatusResult {
  error: boolean;
  message: string;
}

export class StartRequest {
  @ApiProperty()
  ipAndPort: string;

  @ApiProperty()
  user: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  otp: string;
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
    return this.appService.getStdOut() + 'ENDE';
  }

  @Post('/start')
  start(@Res() res, @Body() startRequest: StartRequest): void {
    if (this.appService.isRunning()) {
      res.status(HttpStatus.BAD_REQUEST);
      return;
    }

    this.appService.ipAndPort = startRequest.ipAndPort;
    this.appService.user = startRequest.user;
    this.appService.password = startRequest.password;
    this.appService.otp = startRequest.otp;

    console.log(`ipAndPort: ${startRequest.ipAndPort}`);
    console.log(`user: ${startRequest.user}`);

    this.appService.start();
  }

  @Delete('/stop')
  stop(@Res() res): void {
    if (!this.appService.isRunning()) {
      res.status(HttpStatus.BAD_REQUEST);
      return;
    }

    this.appService.stop();
  }
}