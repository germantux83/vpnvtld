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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.updateStatus();
  }

  public updateStatus(): void {
    this.http.get<StatusResult>('http://192.168.159.128:3000/api/vpn/status').subscribe((status: StatusResult) => {
      this.status = status;
    });
  }

  public onStart(): void {
    console.log('START');
  }

  public onStop(): void {
    console.log('STOP');
  }
}
