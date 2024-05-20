import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { SensorMonitoringComponent } from './sensor-monitoring/sensor-monitoring.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  { path: '', component: MainComponent }, 
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegistrationComponent },
  { path: 'sensor-monitoring', component: SensorMonitoringComponent},
  { path: 'user', component: UserComponent},
];
