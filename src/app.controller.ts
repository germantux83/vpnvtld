import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AppService, VpnStatus } from './app.service';

export interface StatusResult {
  error: VpnStatus;
  message: string;
  output: string;
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
    const status = this.appService.getStatus();
    return {
      error: status,
      message: VpnStatus[status],
      output: this.appService.getStdOut(),
    };
  }

  @Get('/output')
  getOutput(): string {
    return this.appService.getStdOut() + 'ENDE';
  }

  @Post('/start')
  start(@Body() startRequest: StartRequest): void {
    if (this.appService.isRunning()) {
      throw new BadRequestException('Service already running');
    }

    this.appService.ipAndPort = startRequest.ipAndPort;
    this.appService.user = startRequest.user;
    this.appService.password = startRequest.password;
    this.appService.otp = startRequest.otp;

    this.appService.start();
  }

  @Delete('/stop')
  stop(): void {
    if (!this.appService.isRunning()) {
      throw new BadRequestException('Service not running');
    }

    this.appService.stop();
  }
}