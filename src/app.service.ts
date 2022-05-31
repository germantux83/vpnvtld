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

  private onData(data: string): void {
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
  }

  start(): void {
    this.stdout = '';
    this.process = spawn('sh', ['-c', `/opt/forticlientsslvpn/64bit/forticlientsslvpn_cli --server '${this.ipAndPort}' --user '${this.user}'`]);

    this.process.stdout.on('data', this.onData);
    this.process.stderr.on('data', this.onData);

    this.process.on('exit', () => {
      console.log('\n***ENDE ' + this.process.exitCode);
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
