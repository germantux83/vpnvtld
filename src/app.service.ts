import { Injectable } from '@nestjs/common';
import { IPty, spawn } from 'node-pty';

@Injectable()
export class AppService {
  process: IPty = null;
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
    this.process = spawn('bash', [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    });

    const test = '123123';

    this.process.write(
      `/opt/forticlientsslvpn/64bit/forticlientsslvpn_cli --server '${test}' --vpnuser '${this.user}'\n`,
    );

    this.process.onData((data: string) => {
      this.stdout += data;

      if (this.stdout.endsWith('Password for VPN:')) {
        this.process.write(this.password);
      }
      if (this.stdout.endsWith('(Y/N))')) {
        this.process.write('Y');
      }
      if (this.stdout.endsWith('A FortiToken code is required for SSL-VPN login authentication.')) {
        this.process.write('Y');
      }
  
      // Errors
      // 'NOTICE::Insufficient credential(s). Please check the password, client certificate, etc.'
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
