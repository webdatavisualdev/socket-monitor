import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Monitor';
  profiles = [];
  gates = [1, 2, 3, 4];
  entranceNum = 0;
  exitNum = 0;

  constructor(
    private apiService: ApiService,
  ) {
    if (localStorage.getItem('logged_date') && parseInt(localStorage.getItem('logged_date'), 10) !== new Date().getDate()) {
      this.entranceNum = 0;
      this.exitNum = 0;
      localStorage.setItem('entranceNum', '0');
      localStorage.setItem('exitNum', '0');
      localStorage.setItem('logged_date', new Date().getDate().toString());
    } else if (!localStorage.getItem('logged_date')) {
      localStorage.setItem('logged_date', new Date().getDate().toString());
    } else if (localStorage.getItem('logged_date') && parseInt(localStorage.getItem('logged_date'), 10) === new Date().getDate()) {
      this.entranceNum = parseInt(localStorage.getItem('entranceNum'), 10) || 0;
      this.exitNum = parseInt(localStorage.getItem('exitNum'), 10) || 0;
    }

    this.apiService.profile.subscribe(res => {
      this.profiles = [];
      if (res) {
        res.forEach(p => {
          if (p.action === 1 && p.new) {
            this.entranceNum ++;
          } else if (p.action === 2 && p.new) {
            this.exitNum ++;
          }
          localStorage.setItem('entranceNum', this.entranceNum.toString());
          localStorage.setItem('exitNum', this.exitNum.toString());
          this.profiles[parseInt(p.gate_no, 10)] = p;
        });
      }
    });
  }
}
