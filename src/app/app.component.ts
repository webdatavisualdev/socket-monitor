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
    this.gates.forEach(g => {
      this.profiles[g] = null;
    });

    this.apiService.profile.subscribe(res => {
      this.entranceNum = 0;
      this.exitNum = 0;
      this.profiles = [];
      
      if (res) {
        res.forEach(p => {
          if (p.action == 1) {
            this.entranceNum ++;
          } else {
            this.exitNum ++;
          }
          this.profiles[parseInt(p.gate_no)] = p;
        });
      }
    });
  }
}
