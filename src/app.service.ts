import { Injectable } from '@nestjs/common';
import { IPty, spawn } from 'node-pty';

@Injectable()
export class AppService {
  process: IPty = null;
  stdout: string = null;
  password: string = null;
  ipAndPort: string = null;
  user: string = null;
  otp: string = null;

  isRunning(): boolean {
    return this.process != null;
  }

  start(): void {
    this.stdout = '';
    this.process = spawn('bash', [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    });

    const ipAndPort_ = this.ipAndPort;

    this.process.write(
      `/opt/forticlientsslvpn/64bit/forticlientsslvpn_cli --server '${ipAndPort_}' --vpnuser '${this.user}'\n`,
    );

    this.process.onData((data: string) => {
      this.stdout += data;

      if (this.stdout.endsWith('Password for VPN:')) {
        this.process.write(this.password + '\n');
      }
      if (this.stdout.endsWith('(Y/N)\r\n')) {
        this.process.write('Y\n');
      }
      if (this.stdout.endsWith('A FortiToken code is required for SSL-VPN login authentication.\r\n')) {
        this.process.write(this.otp + '\n');
      }
  
      // Errors
      if (this.stdout.includes('STATUS::Set up tunnel failed')) {
        console.log('FAILED');
      }
      if (this.stdout.includes('NOTICE::Insufficient credential(s). Please check the password, client certificate, etc.')) {
        console.log('AUTH FAILED');
      }
    });

    this.process.onExit((e) => {
      console.log('\n***ENDE ' + e.exitCode);
      this.process = null;
    });
  }

  getStdOut(): string {
    return this.stdout;
  }

  stop(): void {
    if (this.process == null) {
      return;
    }
    this.process.kill('SIGKILL');
  }
}
