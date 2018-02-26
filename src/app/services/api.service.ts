import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ApiService {
  private url = 'http://localhost:3000/';
  private socket;
  profile = new BehaviorSubject(null);

  constructor(
    private http: Http,
  ) {
    this.socket = io(this.url);
    this.socket.on('profile', (data) => {
      this.profile.next(data.sort(function(a, b) {
        if (a.gate_no > b.gate_no) return true;
        else return false;
      }));
    });
  }
}
