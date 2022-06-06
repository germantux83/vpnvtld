import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export enum VpnStatus {
  None,
  Starting,
  Connected,
  Closed,
  AuthFailed,
  Error,
}

export interface StatusResult {
  error: VpnStatus;
  message: string;
  output: string;
}

export interface StartRequest {
  ipAndPort: string;
  user: string;
  password: string;
  otp: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'webcli';
  status: StatusResult = {
    error: VpnStatus.None,
    message: 'None',
    output: '',
  };

  // baseUrl = 'http://192.168.159.128:3000';
  // baseUrl = 'http://127.0.0.1:3000';
  baseUrl = '';

  req: StartRequest = {
    ipAndPort: '91.103.8.129:443',
    otp: '',
    password: '',
    user: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.updateStatus();
  }

  public updateStatus(): void {
    this.http.get<StatusResult>(`${this.baseUrl}/api/vpn/status`).subscribe((status: StatusResult) => {
      this.status = status;
    });
  }

  public onStart(): void {
    this.http.post<void>(`${this.baseUrl}/api/vpn/start`, this.req).subscribe(() => {
      this.updateStatus();
    });
  }

  public onStop(): void {
    this.http.delete<void>(`${this.baseUrl}/api/vpn/stop`).subscribe(() => {
      this.updateStatus();
    });
  }
}
