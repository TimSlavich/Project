import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { Header2Component } from './header2/header2.component';
import { FooterComponent } from './footer/footer.component';
import { SensorMonitoringComponent } from './sensor-monitoring/sensor-monitoring.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/AuthService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MainComponent,
    HeaderComponent,
    Header2Component,
    CommonModule,
    FooterComponent,
    SensorMonitoringComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  title = 'Agro-app';
}
