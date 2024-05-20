import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/AuthService.service';
import { AuthorizedService } from '../Services/Authorized.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registrationData = {
    firstName: '',
    lastName: '',
    address: '',
    contactNumber: '',
    email: '',
    password: ''
  };

  constructor(
    private authorizedService: AuthorizedService,
    private authService: AuthService,
    private router: Router
    ) {}

  register() {
    this.authService.register(this.registrationData).subscribe(
      response => {
        this.router.navigate(['sensor-monitoring']);
        this.authorizedService.UserID = response;
      },
      error => {
        console.error('Error registering user:', error);
      }
    );
  }

  login() {
    this.router.navigate(['/login']); 
  }
}
