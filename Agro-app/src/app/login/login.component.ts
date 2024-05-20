import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/AuthService.service';
import { AuthorizedService } from '../Services/Authorized.service';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  constructor(
    private authorizedService: AuthorizedService,
    private authService: AuthService,
    private router: Router
  ) { }
  login() {
    this.authService.login(this.loginData).subscribe({
      next: response => {
        this.authService.isLoggedIn = true;
        this.router.navigate(['sensor-monitoring']);
        this.authorizedService.UserID = response;
      },
      error: error => {
        console.error('Error logging in', error);
        alert('Invalid email or password');
      }
    });
  }

  register() {
    this.router.navigate(['/register']);
  }
}
