import { Injectable } from '@nestjs/common';
import { ChildProcess, spawn } from 'child_process';

@Injectable()
export class AppService {
  process: ChildProcess = null;
  stdout: string = null;
  password = '';
  ipAndPort = '91.103.8.129:443';
  user = 'khs-fieldservices-central';
  otp = '000000';

  isRunning(): boolean {
    return this.process != null;
  }

  start(): void {
    this.stdout = '';
    this.process = spawn('/opt/forticlientsslvpn/64bit/forticlientsslvpn_cli', ['--server', this.ipAndPort, '--user', this.user]);

    this.process.stdout.on('data', (data) => {
      this.stdout += data;

      if (this.stdout.endsWith('Password for VPN:')) {
        this.process.stdin.write(this.password);
      }
      if (this.stdout.endsWith('(Y/N))')) {
        this.process.stdin.write('Y');
      }
      if (this.stdout.endsWith('A FortiToken code is required for SSL-VPN login authentication.')) {
        this.process.stdin.write('Y');
      }

      // Errors
      // 'NOTICE::Insufficient credential(s). Please check the password, client certificate, etc.'
      
    });

    this.process.on('exit', () => {
      console.log('\n***ENDE');
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
