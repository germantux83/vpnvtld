import { Injectable } from '@nestjs/common';
import { ChildProcess, spawn } from 'node:child_process';
import { WriteStream } from 'node:fs';
import { stringify } from 'node:querystring';

@Injectable()
export class AppService {
  process: ChildProcess = null;
  stdout: string = null;

  isRunning(): boolean {
    return this.process != null;
  }

  start(): void {
    // new WriteStream()

    this.process = spawn('c:\\Program Files\\nodejs\\node.exe', ['--help']); //, { stdio: [ 'pipe', 'pipe', 'pipe' ]});
    this.stdout = '';

    this.process.stdout.on('data', (data) => {
      this.stdout += data;
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
