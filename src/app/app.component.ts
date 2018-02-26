import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Monitor';
  profiles = null;
  entranceNum = 0;
  exitNum = 0;

  constructor(
    private apiService: ApiService,
  ) {
    this.apiService.profile.subscribe(res => {
      this.entranceNum = 0;
      this.exitNum = 0;
      
      this.profiles = res;
      if (this.profiles) {
        this.profiles.forEach(p => {
          if (p.action == 1) {
            this.entranceNum ++;
          } else {
            this.exitNum ++;
          }
        });
      }
    });
  }
}
